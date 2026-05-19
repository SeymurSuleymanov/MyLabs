import { useAppDispatch, useAppSelector } from './hooks'  

import Dashboard from './components/Dashboard'
import Table from './components/Table'

function App() {
    const dispatch = useAppDispatch()
    const currentId = useAppSelector(state => state.documents.currentId)

    if (!currentId) {
        return <Dashboard />
    }

    return <Table />
}

export default App