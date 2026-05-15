import { useState, useEffect } from "react";
import "./Table.css";
import { updateDocument, getDocument } from './storage';

type CellValue = string | number | boolean;

interface Cell {
    raw: string;
    computed: CellValue;
}

//создание таблицы
function createTable(row: number, col: number) {
    const arr: Cell[][] = [];
    for (let i = 0; i < row; i++) {
        arr[i] = [];
        for (let j = 0; j < col; j++) {
            arr[i][j] = { raw: " ", computed: " " };
        }
    }
    return arr;
}

//функ-ция для заголовка таблиц
function getColumnLetter(colIndex: number): string {
    let result = "";
    let num = colIndex;
    while (num >= 0) {
        result = String.fromCharCode(65 + (num % 26)) + result;
        num = Math.floor(num / 26) - 1;
    }
    return result;
}

//парсер колонок A-Z и далее
function parseColumn(colStr: string): number {
    let result = 0;
    for (let i = 0; i < colStr.length; i++) {
        result = result * 26 + (colStr.charCodeAt(i) - 64);
    }
    return result - 1; 
}
//функция формул
function computeValue(raw: string, table: Cell[][]): CellValue {
    raw = raw.trim();
    
    if (!raw.startsWith("=")) {
        if (!isNaN(Number(raw))) return Number(raw);
        if (raw === "true") return true;
        if (raw === "false") return false;
        return raw;
    }
    
    const f = raw.slice(1).trim();

    if (f.startsWith("SUM(") && f.endsWith(")")) {
        const range = f.slice(4, -1);
        const [start, end] = range.split(":");
        
        const startMatch = start.match(/[A-Z]+|\d+/g);
        const endMatch = end.match(/[A-Z]+|\d+/g);
        
        if (!startMatch || !endMatch) return "Ошибка";
        
        const startCol = parseColumn(startMatch[0]);
        const startRow = parseInt(startMatch[1]) - 1;
        const endCol = parseColumn(endMatch[0]);
        const endRow = parseInt(endMatch[1]) - 1;
        
        let sum = 0;
        for (let r = Math.min(startRow, endRow); r <= Math.max(startRow, endRow); r++) {
            for (let c = Math.min(startCol, endCol); c <= Math.max(startCol, endCol); c++) {
                const val = table[r]?.[c]?.computed;
                if (typeof val === "number") sum += val;
            }
        }
        return sum;
    }

    if (f.startsWith("AVERAGE(") && f.endsWith(")")) {
        const range = f.slice(8, -1);
        const [start, end] = range.split(":");
        
        const startMatch = start.match(/[A-Z]+|\d+/g);
        const endMatch = end.match(/[A-Z]+|\d+/g);
        
        if (!startMatch || !endMatch) return "Ошибка";
        
        const startCol = parseColumn(startMatch[0]);
        const startRow = parseInt(startMatch[1]) - 1;
        const endCol = parseColumn(endMatch[0]);
        const endRow = parseInt(endMatch[1]) - 1;
        
        let sum = 0, count = 0;
        for (let r = Math.min(startRow, endRow); r <= Math.max(startRow, endRow); r++) {
            for (let c = Math.min(startCol, endCol); c <= Math.max(startCol, endCol); c++) {
                const val = table[r]?.[c]?.computed;
                if (typeof val === "number") { sum += val; count++; }
            }
        }
        return count > 0 ? sum / count : "Ошибка";
    }

    // 3. A1+B1, A1*2, 10-5
    if (/[+\-*/]/.test(f) && !f.includes("(")) {
        try {
            let expr = f;
            expr = expr.replace(/[A-Z]+\d+/g, (ref) => {
                const match = ref.match(/[A-Z]+|\d+/g);
                if (!match) return "0";
                const col = parseColumn(match[0]);
                const row = parseInt(match[1]) - 1;
                const val = table[row]?.[col]?.computed;
                return typeof val === "number" ? String(val) : "0";
            });
            const result = eval(expr);
            return typeof result === "number" ? result : "Ошибка";
        } catch {
            return "Ошибка";
        }
    }
    
    return "?";
}

//функция для логики выделения ячеек через shift
function isRange(cell, range) {
    if (!range) return false;

    const [r1, c1] = range.start.split("-").map(Number);
    const [r2, c2] = range.end.split("-").map(Number);
    const [r, c] = cell.split("-").map(Number);

    const minRow = Math.min(r1, r2);
    const maxRow = Math.max(r1, r2);

    const minCol = Math.min(c1, c2);
    const maxCol = Math.max(c1, c2);

    return r >= minRow && r <= maxRow && c >= minCol && c <= maxCol;
};

//измнение движении столбцов
function Resizer({ width, onResize }) {
    return (
        <div
            onMouseDown={(e) => {
                e.preventDefault();
                const startX = e.clientX;
                const startW = width;
                const move = (m) => {
                    const newW = startW + (m.clientX - startX);
                    if (newW > 40) onResize(newW);
                };
                const up = () => {
                    document.removeEventListener('mousemove', move);
                    document.removeEventListener('mouseup', up);
                };
                document.addEventListener('mousemove', move);
                document.addEventListener('mouseup', up);
            }}
            style={{ position: 'absolute', right: -3, top: 0, width: 6, height: '100%', cursor: 'col-resize', background: 'transparent' }}
        />
    );
}


//измененние передвежение строк
function ResizerRow({ height, onResize }) {
    return (
        <div
            onMouseDown={(e) => {
                e.preventDefault();
                const startY = e.clientY;
                const startH = height;
                const move = (m) => {
                    const newH = startH + (m.clientY - startY);
                    if (newH > 25) onResize(newH);
                };
                const up = () => {
                    document.removeEventListener('mousemove', move);
                    document.removeEventListener('mouseup', up);
                };
                document.addEventListener('mousemove', move);
                document.addEventListener('mouseup', up);
            }}
            style={{ position: 'absolute', bottom: -3, left: 0, width: '100%', height: 6, cursor: 'row-resize', background: 'transparent' }}
        />
    );
}

//основная функц-ия
function Table({ documentId, onBack }) {

    const [table, setTable] = useState<Cell[][]>(() => createTable(26, 100));
    const [select, setSelect] = useState(null);
    const [editing, setEditing] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [lastCell, setLastCell] = useState(null);
    const [range, setRange] = useState(null);

    const [activeCell, setActiveCell] = useState(null);

    const [menuPosition, setMenuPosition] = useState(null);
    const [menuCell, setMenuCell] = useState(null);

    const [colWidths, setColWidths] = useState(Array(table[0].length).fill(80));
    const [rowHeights, setRowHeights] = useState(Array(table.length).fill(40));
    const [saveStatus, setSaveStatus] = useState('saved');

    useEffect(() => {
        const handleClick = () => setMenuPosition(null);
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    //предупреждение при несохранении
    useEffect(() => {
    const handleBeforeUnload = (e) => {
        if (saveStatus === 'saving') {
            e.preventDefault();
            e.returnValue = 'Есть несохранённые изменения';
        }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [saveStatus]);

    // load documents change id 
    useEffect(() => {
        const doc = getDocument(documentId)
        if (doc && doc.data) {
            setTable(doc.data)
            setColWidths(Array(doc.data[0]?.length || 100).fill(80))
            setRowHeights(Array(doc.data.length).fill(40))
        }
    }, [documentId])
    //автосохранение
    useEffect(() => {
        const timer = setTimeout(() => {
            setSaveStatus('saving')
            try {
                updateDocument(documentId, table)
                setSaveStatus('saved')
            } catch {
                setSaveStatus('error')
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [table, documentId])

    //Ctrl+S
    useEffect(() => {
        const handleSave = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault()
                updateDocument(documentId, table)
                setSaveStatus('saved')
            }
        }
        window.addEventListener('keydown', handleSave)
        return () => window.removeEventListener('keydown', handleSave)
    }, [table, documentId])

    //функ-ции для работы добавления, удаления row col

    const addRow = (index) => {
        const newTable = [...table];
        const newRow = Array(table[0].length).fill({ raw: " ", computed: " " });
        newTable.splice(index, 0, newRow);
        setTable(newTable);
    };

    const deleteRow = (index) => {
        const newTable = [...table];
        newTable.splice(index, 1);
        setTable(newTable);
    };

    const addColumn = (index) => {
        const newTable = table.map(row => {
            const newRow = [...row];
            newRow.splice(index, 0, { raw: " ", computed: " " });
            return newRow;
        });
        setTable(newTable);
    };

    const deleteColumn = (index) => {
        const newTable = table.map(row => {
            const newRow = [...row];
            newRow.splice(index, 1);
            return newRow;
        });
        setTable(newTable);
    };

    const startEdit = (row, col, currentValue) => {
        setEditing({ row, col });
        setEditValue(currentValue);
    };

    const saveEdit = () => {
        if (!editing) return;
        const newTable = [...table];
        const rawValue = editValue;
        const computedValue = computeValue(rawValue, table);
        
        newTable[editing.row][editing.col] = { raw: rawValue, computed: computedValue };
        setTable(newTable);
        setEditing(null);
    };

    const columnHeaders = [];
    for (let i = 0; i < table[0].length; i++) {
        columnHeaders.push(getColumnLetter(i));
    }

    const rowHeaders = [];
    for (let i = 0; i < table.length; i++) {
        rowHeaders.push((i + 1).toString());
    }

return (
    <>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', alignItems: 'center' }}>
            <button onClick={onBack}>← Назад к документам</button>
            <span>
                {saveStatus === 'saving' && '💾 Сохранение...'}
                {saveStatus === 'saved' && '✅ Сохранено'}
                {saveStatus === 'error' && '❌ Ошибка'}
            </span>
        </div>

        <input 
            value={activeCell ? table[activeCell.split("-")[0]]?.[activeCell.split("-")[1]]?.raw : ""}
            onChange={(e) => {
                if (!activeCell) return;
                const [row, col] = activeCell.split("-").map(Number);
                const newTable = [...table];
                newTable[row][col] = { raw: e.target.value, computed: computeValue(e.target.value, table) };
                setTable(newTable);
            }}
            placeholder="Введите формулу..."
            className="formula-bar"
        />
        
        <div className="table-wrapper">      
            <div className="table-container">
                <div className="table-row">
                    <div className="corner-cell"></div>
                    {columnHeaders.map((letter, i) => (
                    <div key={`col-${i}`} className="column-header" style={{ width: colWidths[i], position: 'relative' }}>
                        {letter}
                        <Resizer width={colWidths[i]} onResize={(w) => {
                            const copy = [...colWidths];
                            copy[i] = w;
                            setColWidths(copy);
                        }} />
                    </div>
                    ))}
                </div>

                {table.map((row, rowIndex) => ( 
                    <div key={rowIndex} className="table-row">
                        <div className="row-header" style={{ height: rowHeights[rowIndex], position: 'relative' }}>
                            {rowHeaders[rowIndex]}
                            <ResizerRow height={rowHeights[rowIndex]} onResize={(h) => {
                                const copy = [...rowHeights];
                                copy[rowIndex] = h;
                                setRowHeights(copy);
                            }} />
                        </div>
                        
                        {row.map((cell, colIndex) => {
                            const isEditing = editing?.row === rowIndex && editing?.col === colIndex;
                            
                            if (isEditing) {
                                return (
                                    <input
                                        key={`${rowIndex}-${colIndex}`}
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onBlur={saveEdit}
                                        onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                                        autoFocus
                                        className="cell-input"
                                    />
                                );
                            }
                            
                            return (
                                <button 
                                
                                    style={{ width: colWidths[colIndex] }}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        setMenuCell({ row: rowIndex, col: colIndex });
                                        setMenuPosition({ x: e.clientX, y: e.clientY });
                                    }}
                                    onClick={(e) => {
                                        const current = `${rowIndex}-${colIndex}`;
                                        setActiveCell(current);
                                        if (e.shiftKey && lastCell) {
                                            setRange({ start: lastCell, end: current });
                                            setSelect(current);
                                        } else {
                                            setSelect(current);
                                            setLastCell(current);
                                            setRange(null);
                                        }
                                    }}
                                    onDoubleClick={() => startEdit(rowIndex, colIndex, table[rowIndex][colIndex].raw)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            startEdit(rowIndex, colIndex, table[rowIndex][colIndex].raw);
                                        }
                                    }}
                                    key={`${rowIndex}-${colIndex}`} 
                                    className={`cell-button ${
                                        select === `${rowIndex}-${colIndex}` || isRange(`${rowIndex}-${colIndex}`, range) 
                                            ? "select" 
                                            : ""
                                    }`}>
                                    {table[rowIndex][colIndex].computed}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
        {menuPosition && (
            <div 
                style={{
                    position: 'fixed',
                    top: menuPosition.y,
                    left: menuPosition.x
                }}
            >
                <button onClick={() => { addRow(menuCell.row); setMenuPosition(null); }}>Добавить строку</button>
                <button onClick={() => { deleteRow(menuCell.row); setMenuPosition(null); }}>Удалить строку</button>
                <button onClick={() => { addColumn(menuCell.col); setMenuPosition(null); }}>Добавить столбец</button>
                <button onClick={() => { deleteColumn(menuCell.col); setMenuPosition(null); }}>Удалить столбец</button>
            </div>
        )}
    </>
);
}
export default Table;