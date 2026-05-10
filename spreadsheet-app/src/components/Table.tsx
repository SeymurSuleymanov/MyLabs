import { useState } from "react";
import "./Table.css";

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

//основная функц-ия
function Table() {
    const [table, setTable] = useState<Cell[][]>(createTable(26, 30));
    const [select, setSelect] = useState(null);
    const [editing, setEditing] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [lastCell, setLastCell] = useState(null);
    const [range, setRange] = useState(null);

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
        <div className="table-wrapper">      
            <div className="table-container">
                <div className="table-row">
                    <div className="corner-cell"></div>
                    {columnHeaders.map((letter, i) => (
                        <div key={`col-${i}`} className="column-header">{letter}</div>
                    ))}
                </div>

                {table.map((row, rowIndex) => ( 
                    <div key={rowIndex} className="table-row">
                        <div className="row-header">{rowHeaders[rowIndex]}</div>
                        
                {row.map((cell, colIndex) => {
                    const isEditing = editing?.row === rowIndex && editing?.col === colIndex;
                    //редактирование
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
                    //вывод
                    return (
                        <button 
                            onClick={(e) => {
                                const current = `${rowIndex}-${colIndex}`;
                                
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
    )
}
export default Table;