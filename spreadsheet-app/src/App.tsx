import { useAppDispatch, useAppSelector } from './store'
import { setCurrentDocument } from './store'

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