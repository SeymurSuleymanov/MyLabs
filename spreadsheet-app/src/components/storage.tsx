export type CellValue = string | number | boolean;

export interface Cell {
    raw: string;
    computed: CellValue;
}

interface Document {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    data: Cell[][];
    preview: string[][];
    userId: string;
    styles?: any;
}

const STORAGE_KEY = 'excel_documents'

export const getDocument = (id: string): Document | null => {
    const docs = getDocuments()
    return docs.find(d => d.id === id) || null
}


// get every documents
export const getDocuments = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
}

// save documents
const saveDocuments = (docs: Document[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs))
}
// create new document
export const createDocument = (title: string, rows: number, cols: number, userId: string): Document => {
    const docs = getDocuments()

    const data: Cell[][] = []
    for (let i = 0; i < rows; i++) {
        data[i] = []
        for (let j = 0; j < cols; j++) {
            data[i][j] = { raw: "", computed: "" }
        }
    }

    //preview 3x3
    const preview: string[][] = []
    for (let i = 0; i < Math.min(3, rows); i++) {
        preview[i] = []
        for (let j = 0; j < Math.min(3, cols); j++) {
            preview[i][j] = data[i][j].computed?.toString() || " "
        }
    }
    
    const newDoc: Document = {
        id: Date.now().toString(),
        title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data,
        preview,
        userId  // добавляем userId
    }
    
    docs.push(newDoc)
    saveDocuments(docs)
    return newDoc
}

// Update document (auto save)
export const updateDocument = (id: string, data: Cell[][], styles?: any) => {
    const docs = getDocuments()
    const index = docs.findIndex(d => d.id === id)
    
    if (index !== -1) {
        const rows = data.length
        const cols = data[0]?.length || 0
        
        const preview: string[][] = []
        for (let i = 0; i < Math.min(3, rows); i++) {
            preview[i] = []
            for (let j = 0; j < Math.min(3, cols); j++) {
                preview[i][j] = data[i]?.[j]?.computed?.toString() || " "
            }
        }
        
        docs[index] = {
            ...docs[index],
            data,
            preview,
            updatedAt: new Date().toISOString(),
            styles: styles || docs[index].styles
        }
        saveDocuments(docs)
    }
}

// del
export const deleteDocument = (id: string) => {
    const docs = getDocuments()
    const filtered = docs.filter(d => d.id !== id)
    saveDocuments(filtered)
}

// get documents by id
export const getDocumentsByUser = (userId: string) => {
    const docs = getDocuments()
    return docs.filter(d => d.userId === userId)
}

// Rename documents
export const renameDocument = (id: string, newTitle: string) => {
    const docs = getDocuments()
    const index = docs.findIndex(d => d.id === id)
    
    if (index !== -1) {
        docs[index].title = newTitle
        docs[index].updatedAt = new Date().toISOString()
        saveDocuments(docs)
    }
}

// Дублируем документ
export const duplicateDocument = (id: string) => {
    const original = getDocument(id)
    
    if (original && original.data) {
        const docs = getDocuments()
        
        const copiedData = JSON.parse(JSON.stringify(original.data))
        
        const newDoc: Document = {
            id: Date.now().toString(),
            title: `${original.title} (копия)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            data: copiedData,
            preview: original.preview.map(row => [...row]),
            userId: original.userId  // ← ЭТА СТРОКА БЫЛА ПРОПУЩЕНА
        }
        
        docs.push(newDoc)
        saveDocuments(docs)
        return newDoc
    }
}