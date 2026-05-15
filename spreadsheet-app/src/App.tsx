import { useState } from "react"
import Table from "./components/Table"
import Dashboard from "./components/Dashboard"

function App() {
    const [currentDocId, setCurrentDocId] = useState(null)

    if (!currentDocId) {
        return <Dashboard onSelectDocument={setCurrentDocId} />
    }

    return <Table documentId={currentDocId} onBack={() => setCurrentDocId(null)} />
}

export default App