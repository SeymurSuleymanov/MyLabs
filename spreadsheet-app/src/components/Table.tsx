import { useState } from "react";
import "./Table.css";

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

function getColumnLetter(colIndex: number): string {
    let result = "";
    let num = colIndex;
    while (num >= 0) {
        result = String.fromCharCode(65 + (num % 26)) + result;
        num = Math.floor(num / 26) - 1;
    }
    return result;
}

function Table() {
    const [table, setTable] = useState(createTable(26, 100));
    const [select, setSelect] = useState(null);
    const [editing, setEditing] = useState(null);
    const [editValue, setEditValue] = useState("");

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
                            onDoubleClick={() => startEdit(rowIndex, colIndex, table[rowIndex][colIndex])}
                            onClick={() => setSelect(`${rowIndex}-${colIndex}`)}
                            key={`${rowIndex}-${colIndex}`} 
                            className={`cell-button ${select === `${rowIndex}-${colIndex}` ? "select" : ""}`}>
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