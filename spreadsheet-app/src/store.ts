import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { getDocuments, getDocument, createDocument as createDoc, updateDocument, deleteDocument as deleteDoc, renameDocument as renameDoc, duplicateDocument as duplicateDoc } from './components/storage'

// Thunks
export const fetchDocuments = createAsyncThunk('documents/fetchDocuments', async () => {
    return getDocuments()
})

export const createNewDocument = createAsyncThunk('documents/createNewDocument', async ({ title, rows, cols }) => {
    return createDoc(title, rows, cols)
})

export const deleteDocumentThunk = createAsyncThunk('documents/deleteDocumentThunk', async (id) => {
    deleteDoc(id)
    return id
})

export const renameDocumentThunk = createAsyncThunk('documents/renameDocumentThunk', async ({ id, newTitle }) => {
    renameDoc(id, newTitle)
    return { id, newTitle }
})

export const duplicateDocumentThunk = createAsyncThunk('documents/duplicateDocumentThunk', async (id) => {
    duplicateDoc(id)
    return id
})

// spreadsheet слайс
const spreadsheetSlice = createSlice({
    name: 'spreadsheet',
    initialState: {
        table: [],
        selectedCell: null,
        history: { past: [], future: [] }
    },
    reducers: {
        setTable: (state, action) => {
            if (state.table.length > 0) {
                state.history.past.push(JSON.parse(JSON.stringify(state.table)))
            }
            state.table = action.payload
            state.history.future = []
        },
        updateCell: (state, action) => {
            state.history.past.push(JSON.parse(JSON.stringify(state.table)))
            const { row, col, cell } = action.payload
            state.table[row][col] = cell
            state.history.future = []
        },
        setSelectedCell: (state, action) => {
            state.selectedCell = action.payload
        },
        undo: (state) => {
            if (state.history.past.length === 0) return
            const prev = state.history.past.pop()
            if (prev) {
                state.history.future.push(JSON.parse(JSON.stringify(state.table)))
                state.table = prev
            }
        },
        redo: (state) => {
            if (state.history.future.length === 0) return
            const next = state.history.future.pop()
            if (next) {
                state.history.past.push(JSON.parse(JSON.stringify(state.table)))
                state.table = next
            }
        }
    }
})

// documents слайс
const documentsSlice = createSlice({
    name: 'documents',
    initialState: {
        list: [],
        currentId: null,
        status: 'idle'
    },
    reducers: {
        setCurrentDocument: (state, action) => {
            state.currentId = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDocuments.fulfilled, (state, action) => {
                state.list = action.payload
                state.status = 'succeeded'
            })
            .addCase(createNewDocument.fulfilled, (state, action) => {
                state.list.push(action.payload)
            })
            .addCase(deleteDocumentThunk.fulfilled, (state, action) => {
                state.list = state.list.filter(d => d.id !== action.payload)
            })
            .addCase(renameDocumentThunk.fulfilled, (state, action) => {
                const doc = state.list.find(d => d.id === action.payload.id)
                if (doc) doc.title = action.payload.newTitle
            })
    }
})

// ui слайс
const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        saveStatus: 'saved',
        showModal: false,
        modalData: { title: 'Новая таблица', rows: 10, cols: 5 }
    },
    reducers: {
        setSaveStatus: (state, action) => {
            state.saveStatus = action.payload
        },
        setShowModal: (state, action) => {
            state.showModal = action.payload
        },
        setModalData: (state, action) => {
            state.modalData = action.payload
        }
    }
})

interface AuthState {
    user: null | { id: string; name: string; email: string }
    accessToken: string | null
    refreshToken: string | null
}

// auth слайс
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        accessToken: null,
        refreshToken: null
    } as AuthState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setTokens: (state, action) => {
            state.accessToken = action.payload.accessToken
            state.refreshToken = action.payload.refreshToken
        },
        logout: (state) => {
            state.user = null
            state.accessToken = null
            state.refreshToken = null
        }
    }
})


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        accessToken: null,
        refreshToken: null
    } as AuthState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setTokens: (state, action) => {
            state.accessToken = action.payload.accessToken
            state.refreshToken = action.payload.refreshToken
        },
        logout: (state) => {
            state.user = null
            state.accessToken = null
            state.refreshToken = null
        }
    }
})

// middleware
let saveTimeout = null

const autoSaveMiddleware = (store) => (next) => (action) => {
    const result = next(action)
    
    const state = store.getState()
    const currentId = state.documents.currentId
    const table = state.spreadsheet.table
    
    if (action.type?.startsWith('spreadsheet/') && action.type !== 'spreadsheet/undo' && action.type !== 'spreadsheet/redo') {
        if (saveTimeout) clearTimeout(saveTimeout)
        saveTimeout = setTimeout(() => {
            if (currentId && table.length > 0) {
                updateDocument(currentId, table)
            }
        }, 500)
    }
    
    return result
}

export const store = configureStore({
    reducer: {
        spreadsheet: spreadsheetSlice.reducer,
        documents: documentsSlice.reducer,
        ui: uiSlice.reducer,
        auth: authSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(autoSaveMiddleware),
    devTools: true
})

export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector

export const { setTable, updateCell, setSelectedCell, undo, redo } = spreadsheetSlice.actions
export const { setCurrentDocument } = documentsSlice.actions
export const { setSaveStatus, setShowModal, setModalData } = uiSlice.actions
export const { setUser, setTokens, logout } = authSlice.actions