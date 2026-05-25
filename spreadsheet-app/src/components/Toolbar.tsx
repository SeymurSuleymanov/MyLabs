import { useAppDispatch, useAppSelector } from '../store'
import { setCellStyle } from '../store'

const Toolbar = ({ selectedCell }) => {
    const dispatch = useAppDispatch()
    const styles = useAppSelector(state => state.spreadsheet.styles)
    
    if (!selectedCell) return null
    
    const cellStyle = styles[selectedCell] || {}
    
    const applyStyle = (styleProp, value) => {
        dispatch(setCellStyle({ key: selectedCell, style: { [styleProp]: value } }))
    }
    
    return (
        <div style={{ padding: '10px', background: '#f5f5f5', borderBottom: '1px solid #ccc', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => applyStyle('bold', !cellStyle.bold)} style={{ fontWeight: cellStyle.bold ? 'bold' : 'normal' }}>B</button>
            <button onClick={() => applyStyle('italic', !cellStyle.italic)} style={{ fontStyle: cellStyle.italic ? 'italic' : 'normal' }}>I</button>
            <button onClick={() => applyStyle('underline', !cellStyle.underline)} style={{ textDecoration: cellStyle.underline ? 'underline' : 'none' }}>U</button>
            
            <input type="color" value={cellStyle.color || '#000000'} onChange={(e) => applyStyle('color', e.target.value)} title="Цвет текста" />
            <input type="color" value={cellStyle.bgColor || '#ffffff'} onChange={(e) => applyStyle('bgColor', e.target.value)} title="Цвет фона" />
            
            <select value={cellStyle.align || 'left'} onChange={(e) => applyStyle('align', e.target.value)}>
                <option value="left">⬅️ Лево</option>
                <option value="center">⬌ Центр</option>
                <option value="right">➡️ Право</option>
            </select>
            
            <select value={cellStyle.format || 'text'} onChange={(e) => applyStyle('format', e.target.value)}>
                <option value="text">Текст</option>
                <option value="number">Число</option>
                <option value="percent">Процент</option>
                <option value="currency">Валюта</option>
                <option value="date">Дата</option>
            </select>
        </div>
    )
}

export default Toolbar