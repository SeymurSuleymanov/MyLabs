import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store'
import { fetchDocuments, createNewDocument, deleteDocumentThunk, renameDocumentThunk, duplicateDocumentThunk, setCurrentDocument, setShowModal, setModalData } from '../store'

const Dashboard = () => {
    const dispatch = useAppDispatch()
    const documents = useAppSelector(state => state.documents.list)
    const showModal = useAppSelector(state => state.ui.showModal)
    const modalData = useAppSelector(state => state.ui.modalData)
    
    const [editingId, setEditingId] = useState(null)
    const [editTitle, setEditTitle] = useState('')

    useEffect(() => {
        dispatch(fetchDocuments())
    }, [])

    const handleCreate = () => {
        dispatch(createNewDocument({ title: modalData.title, rows: modalData.rows, cols: modalData.cols }))
        dispatch(setShowModal(false))
    }

    const handleDelete = (id) => {
        if (confirm('Точно удалить?')) {
            dispatch(deleteDocumentThunk(id))
        }
    }

    const handleRename = (id) => {
        dispatch(renameDocumentThunk({ id, newTitle: editTitle }))
        setEditingId(null)
    }

    const handleDuplicate = (id) => {
        dispatch(duplicateDocumentThunk(id))
        setTimeout(() => dispatch(fetchDocuments()), 100)
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Мои документы</h1>
            
            <button onClick={() => dispatch(setShowModal(true))} style={{ marginBottom: '20px' }}>
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
                            <button onClick={() => dispatch(setCurrentDocument(doc.id))}>Открыть</button>
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
                }} onClick={() => dispatch(setShowModal(false))}>
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
                            value={modalData.title}
                            onChange={(e) => dispatch(setModalData({ ...modalData, title: e.target.value }))}
                        />
                        <input
                            style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                            type="number"
                            placeholder="Строки"
                            value={modalData.rows}
                            onChange={(e) => dispatch(setModalData({ ...modalData, rows: Number(e.target.value) }))}
                        />
                        <input
                            style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                            type="number"
                            placeholder="Столбцы"
                            value={modalData.cols}
                            onChange={(e) => dispatch(setModalData({ ...modalData, cols: Number(e.target.value) }))}
                        />
                        <button onClick={handleCreate}>Создать</button>
                        <button onClick={() => dispatch(setShowModal(false))}>Отмена</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard