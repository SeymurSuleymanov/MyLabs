import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

// типы
type CellValue = string | number | boolean

interface Cell {
    raw: string
    computed: CellValue
}

interface SpreadsheetState {
    table: Cell[][]
    selectedCell: string | null
    history: {
        past: Cell[][]
        future: Cell[][]
    }
}

interface Document {
    id: string
    title: string
    createdAt: string
    updatedAt: string
    data: Cell[][]
    preview: string[][]
}

interface DocumentsState {
    list: Document[]
    currentId: string | null
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
}

interface UiState {
    saveStatus: 'saved' | 'saving' | 'error'
    showModal: boolean
    modalData: {
        title: string
        rows: number
        cols: number
    }
}

// spreadsheet слайс
const spreadsheetSlice = createSlice({
    name: 'spreadsheet',
    initialState: {
        table: [],
        selectedCell: null,
        history: { past: [], future: [] }
    } as SpreadsheetState,
    reducers: {
        setTable: ( state, action: PayloadAction<Cell[][]> ) => {
            state.history.past.push(JSON.parse(JSON.stringify(state.table)))
            state.table = action.payload
            state.history.future = []
        },
        updateCell: (state, action: PayloadAction<{row: number, col: number, cell: Cell}>) =>{
            state.history.past.push(JSON.parse(JSON.stringify(state.table)))
            const {row, col, cell} = action.payload
            state.table[row][col] = cell
            state.history.future = []
        },
        setSelectedCell: (state, action: PayloadAction<string | null>) => {
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
    } as DocumentsState,
    reducers: {
        setDocuments: (state, action: PayloadAction<Document[]>) => {
            state.list = action.payload
        },
        setCurrentDocument: (state, action: PayloadAction<string | null>) => {
            state.currentId = action.payload
        },
        addDocument: (state, action: PayloadAction<Document>) => {
            state.list.push(action.payload)
        },
        updateDocumentInList: (state, action: PayloadAction<Document>) => {
            const index = state.list.findIndex(d => d.id === action.payload.id)
            if (index !== -1) state.list[index] = action.payload
        },
        removeDocument: (state, action: PayloadAction<string>) => {
            state.list = state.list.filter(d => d.id !== action.payload)
        },
        setStatus: (state, action: PayloadAction<'idle'|'loading'|'succeeded'|'failed'>) => {
            state.status = action.payload
        }
    }
})

// ui слайс
const uiSlice =createSlice({
    name: 'ui',
    initialState: {
        saveStatus: 'saved' as 'saved'|'saving'|'error',
        showModal: false,
        modalData: { title: 'Новая таблица', rows: 10, cols: 5 }
    } as UiState,
    reducers: {
        setSaveStatus: (state, action: PayloadAction<'saved'|'saving'|'error'>) => {
            state.saveStatus = action.payload
        },
        setShowModal: (state, action: PayloadAction<boolean>) => {
            state.showModal = action.payload
        },
        setModalData: (state, action: PayloadAction<{title: string, rows: number, cols: number}>) => {
            state.modalData = action.payload
        }
    }
})

// auth слайс (заготовка)
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: { id: '1', name: 'Mock User', email: 'mock@example.com' }
    },
    reducers: {}
})

export const store = configureStore({
    reducer: {
        spreadsheet: spreadsheetSlice.reducer,
        documents: documentsSlice.reducer,
        ui: uiSlice.reducer,
        auth: authSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const { setTable, updateCell, setSelectedCell, undo, redo } = spreadsheetSlice.actions
export const { setDocuments, setCurrentDocument, addDocument, updateDocumentInList, removeDocument, setStatus } = documentsSlice.actions
export const { setSaveStatus, setShowModal, setModalData } = uiSlice.actions