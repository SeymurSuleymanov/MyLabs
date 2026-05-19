import { describe, it, expect } from 'vitest'
import { configureStore, createSlice } from '@reduxjs/toolkit'

type CellValue = string | number | boolean

interface Cell {
    raw: string
    computed: CellValue
}

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

const { setTable, updateCell, undo, redo } = spreadsheetSlice.actions

describe('spreadsheetSlice', () => {
    it('должен обновить ячейку', () => {
        const store = configureStore({ reducer: { spreadsheet: spreadsheetSlice.reducer } })
        const initialTable = [[{ raw: "", computed: "" }]]
        store.dispatch(setTable(initialTable))
        store.dispatch(updateCell({ row: 0, col: 0, cell: { raw: "123", computed: 123 } }))
        const state = store.getState().spreadsheet
        expect(state.table[0][0].computed).toBe(123)
    })

    it('должен отменить изменение', () => {
        const store = configureStore({ reducer: { spreadsheet: spreadsheetSlice.reducer } })
        store.dispatch(setTable([[{ raw: "1", computed: 1 }]]))
        store.dispatch(updateCell({ row: 0, col: 0, cell: { raw: "2", computed: 2 } }))
        store.dispatch(undo())
        const state = store.getState().spreadsheet
        expect(state.table[0][0].computed).toBe(1)
    })

    it('должен вернуть отменённое изменение', () => {
        const store = configureStore({ reducer: { spreadsheet: spreadsheetSlice.reducer } })
        store.dispatch(setTable([[{ raw: "1", computed: 1 }]]))
        store.dispatch(updateCell({ row: 0, col: 0, cell: { raw: "2", computed: 2 } }))
        store.dispatch(undo())
        store.dispatch(redo())
        const state = store.getState().spreadsheet
        expect(state.table[0][0].computed).toBe(2)
    })
})