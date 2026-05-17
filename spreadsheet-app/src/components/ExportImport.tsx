import { useState } from 'react'

const ExportImport = ({ table, onImport }) => {
    const [showImport, setShowImport] = useState(false)
    const [csvText, setCsvText] = useState('')

    // выгружаем в csv
    const exportToCSV = () => {
        const csvRows = []
        
        for (let i = 0; i < table.length; i++) {
            const row = table[i]
            const rowData = []
            for (let j = 0; j < row.length; j++) {
                let val = row[j].computed?.toString() || ''
                // если там запятая или кавычки - заворачиваем
                if (val.includes(',') || val.includes('"')) {
                    val = `"${val.replace(/"/g, '""')}"`
                }
                rowData.push(val)
            }
            csvRows.push(rowData.join(','))
        }
        
        const csvString = csvRows.join('\n')
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.href = url
        link.setAttribute('download', 'table.csv')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    // json формат
    const exportToJSON = () => {
        const data = table.map(row => 
            row.map(cell => ({
                raw: cell.raw,
                computed: cell.computed
            }))
        )
        
        const jsonString = JSON.stringify(data, null, 2)
        const blob = new Blob([jsonString], { type: 'application/json' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.href = url
        link.setAttribute('download', 'table.json')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    // парсим csv (с кавычками разбирается)
    const parseCSV = (text) => {
        const rows = []
        let currentRow = []
        let currentCell = ''
        let inQuotes = false
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i]
            
            if (char === '"') {
                if (inQuotes && text[i+1] === '"') {
                    currentCell += '"'
                    i++
                } else {
                    inQuotes = !inQuotes
                }
            } else if (char === ',' && !inQuotes) {
                currentRow.push(currentCell.trim())
                currentCell = ''
            } else if (char === '\n' && !inQuotes) {
                currentRow.push(currentCell.trim())
                rows.push(currentRow)
                currentRow = []
                currentCell = ''
            } else {
                currentCell += char
            }
        }
        
        if (currentCell || currentRow.length > 0) {
            currentRow.push(currentCell.trim())
            rows.push(currentRow)
        }
        
        return rows
    }

    // когда импортим
    const handleImport = () => {
        if (!csvText.trim()) return
        
        const parsed = parseCSV(csvText)
        if (parsed.length === 0) return
        
        const newTable = []
        for (let i = 0; i < parsed.length; i++) {
            newTable[i] = []
            for (let j = 0; j < parsed[i].length; j++) {
                const val = parsed[i][j]
                let computed = val
                if (!isNaN(Number(val)) && val !== '') computed = Number(val)
                if (val === 'true') computed = true
                if (val === 'false') computed = false
                
                newTable[i][j] = {
                    raw: val,
                    computed: computed
                }
            }
        }
        
        onImport(newTable)
        setShowImport(false)
        setCsvText('')
    }

    // выбираем файл
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        
        const reader = new FileReader()
        reader.onload = (event) => {
            const content = event.target?.result
            setCsvText(content)
        }
        reader.readAsText(file, 'UTF-8')
    }

    return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={exportToCSV} title="Сохранить как CSV">
                📄 CSV
            </button>
            <button onClick={exportToJSON} title="Сохранить как JSON">
                📦 JSON
            </button>
            <button onClick={() => setShowImport(!showImport)} title="Загрузить CSV">
                📂 Импорт CSV
            </button>
            
            {showImport && (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <div style={{
                        position: 'absolute',
                        top: '30px',
                        right: 0,
                        background: 'white',
                        border: '1px solid #ccc',
                        padding: '10px',
                        borderRadius: '8px',
                        zIndex: 100,
                        width: '300px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            style={{ marginBottom: '8px' }}
                        />
                        <textarea
                            placeholder="Или вставь CSV сюда..."
                            value={csvText}
                            onChange={(e) => setCsvText(e.target.value)}
                            rows={5}
                            style={{ width: '100%', marginBottom: '8px', fontSize: '12px' }}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={handleImport}>Ок</button>
                            <button onClick={() => setShowImport(false)}>Отмена</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ExportImport