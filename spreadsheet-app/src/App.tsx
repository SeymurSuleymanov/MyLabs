import { useAppSelector } from './store'
import Dashboard from './components/Dashboard'
import Table from './components/Table'

function App() {
    const currentId = useAppSelector(state => state.documents.currentId)

    if (!currentId) {
        return <Dashboard />
    }

    return <Table />
}

export default App