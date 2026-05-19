import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import Dashboard from './components/Dashboard'
import Table from './components/Table'
import { useAppSelector } from './store'

// заглушка для профиля
const ProfilePage = () => {
    return (
        <div>
            <h1>Профиль пользователя</h1>
            <p>Имя: Mock User</p>
            <p>Email: mock@example.com</p>
            <p style={{ color: '#999' }}>Авторизация типо</p>
        </div>
    )
}

// страница 404
const NotFoundPage = () => {
    return (
        <div>
            <h1>404</h1>
            <p>Страница не найдена</p>
            <Link to="/dashboard">Вернуться к документам</Link>
        </div>
    )
}

// защита маршрутов (заглушка)
const ProtectedRoute = ({ children }) => {
    // пока всегда true, позже добавим авторизацию
    const isAuth = true
    
    if (!isAuth) {
        return <Navigate to="/login" replace />
    }
    
    return children
}

// обёртка для таблицы с проверкой документа
const SpreadsheetPage = () => {
    const { documentId } = useParams()
    const documents = useAppSelector(state => state.documents.list)
    const docExists = documents.some(d => d.id === documentId)
    
    if (!docExists && documentId) {
        return <Navigate to="/404" replace />
    }
    
    return <Table />
}

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/dashboard" replace />
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <AppLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: 'dashboard',
                element: <Dashboard />
            },
            {
                path: 'documents/:documentId',
                element: <SpreadsheetPage />
            },
            {
                path: 'profile',
                element: <ProfilePage />
            }
        ]
    },
    {
        path: '*',
        element: <NotFoundPage />
    }
])