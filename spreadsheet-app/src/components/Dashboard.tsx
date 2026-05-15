import { useState, useEffect } from 'react'
import { getDocuments, deleteDocument, renameDocument, duplicateDocument, createDocument } from './storage'

const Dashboard = ({ onSelectDocument }) => {
    const [documents, setDocuments] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [newTitle, setNewTitle] = useState('Новая таблица')
    const [newRows, setNewRows] = useState(10)
    const [newCols, setNewCols] = useState(5)
    const [editingId, setEditingId] = useState(null)
    const [editTitle, setEditTitle] = useState('')

    // загружаем документы при монтировании
    const loadDocs = () => {
        const docs = getDocuments()
        setDocuments(docs)
    }

    useEffect(() => {
        loadDocs()
    }, [])

    // создание нового документа
    const handleCreate = () => {
        createDocument(newTitle, newRows, newCols)
        setShowModal(false)
        setNewTitle('Новая таблица')
        loadDocs()
    }

    // удаление
    const handleDelete = (id) => {
        if (confirm('Точно удалить?')) {
            deleteDocument(id)
            loadDocs()
        }
    }

    // переименование
    const handleRename = (id) => {
        renameDocument(id, editTitle)
        setEditingId(null)
        loadDocs()
    }

    // дублирование
    const handleDuplicate = (id) => {
        duplicateDocument(id)
        loadDocs()
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Мои документы</h1>
            
            <button onClick={() => setShowModal(true)} style={{ marginBottom: '20px' }}>
                + Создать документ
            </button>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {documents.map(doc => (
                    <div key={doc.id} style={{ 
                        border: '1px solid #ccc', 
                        padding: '15px', 
                        width: '250px',
                        borderRadius: '8px'
                    }}>
                        {editingId === doc.id ? (
                            <input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onBlur={() => handleRename(doc.id)}
                                onKeyDown={(e) => e.key === 'Enter' && handleRename(doc.id)}
                                autoFocus
                            />
                        ) : (
                            <h3 onDoubleClick={() => {
                                setEditingId(doc.id)
                                setEditTitle(doc.title)
                            }}>
                                {doc.title}
                            </h3>
                        )}
                        
                        {/* превью 3x3 */}
                        <div style={{ 
                            background: '#f5f5f5', 
                            padding: '10px', 
                            margin: '10px 0',
                            fontSize: '12px',
                            fontFamily: 'monospace'
                        }}>
                            {doc.preview.map((row, i) => (
                                <div key={i}>
                                    {row.map((cell, j) => (
                                        <span key={j} style={{ display: 'inline-block', width: '40px' }}>
                                            {cell}
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                        
                        <small style={{ display: 'block', color: '#666' }}>
                            Создан: {new Date(doc.createdAt).toLocaleDateString()}
                        </small>
                        <small style={{ display: 'block', marginBottom: '10px' }}>
                            Изменён: {new Date(doc.updatedAt).toLocaleDateString()}
                        </small>
                        
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                            <button onClick={() => onSelectDocument(doc.id)}>Открыть</button>
                            <button onClick={() => handleDuplicate(doc.id)}>📋 Дублировать</button>
                            <button onClick={() => {
                                setEditingId(doc.id)
                                setEditTitle(doc.title)
                            }}>✏️</button>
                            <button onClick={() => handleDelete(doc.id)}>🗑️</button>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* модальное окно */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} onClick={() => setShowModal(false)}>
                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        width: '300px'
                    }} onClick={e => e.stopPropagation()}>
                        <h2>Новый документ</h2>
                        <input
                            style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                            placeholder="Название"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                        />
                        <input
                            style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                            type="number"
                            placeholder="Строки"
                            value={newRows}
                            onChange={(e) => setNewRows(Number(e.target.value))}
                        />
                        <input
                            style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                            type="number"
                            placeholder="Столбцы"
                            value={newCols}
                            onChange={(e) => setNewCols(Number(e.target.value))}
                        />
                        <button onClick={handleCreate}>Создать</button>
                        <button onClick={() => setShowModal(false)}>Отмена</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard