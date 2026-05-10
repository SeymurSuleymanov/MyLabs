import { useState } from "react";
import "./Table.css";

//создание таблицы
function createTable(row: number, col: number) {
    const arr: string[][] = [];
    for (let i = 0; i < row; i++) {
        arr[i] = [];
        for (let j = 0; j < col; j++) {
            arr[i][j] = " ";
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
    const [table, setTable] = useState(createTable(26, 100));
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
        const newData = [...table];
        newData[editing.row][editing.col] = editValue;
        setTable(newData);
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
                            onDoubleClick={() => startEdit(rowIndex, colIndex, table[rowIndex][colIndex])}
                            key={`${rowIndex}-${colIndex}`} 
                            className={`cell-button ${
                                select === `${rowIndex}-${colIndex}` || isRange(`${rowIndex}-${colIndex}`, range) 
                                    ? "select" 
                                    : ""
                            }`}>
                            {table[rowIndex][colIndex]}
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