import { createBrowserRouter, Navigate, Link, useParams } from 'react-router-dom'
import AppLayout from './AppLayout'
import Dashboard from './components/Dashboard'
import Table from './components/Table'
import LoginPage from './services/LoginPage'
import RegisterPage from './services/RegisterPage'
import { useAppSelector } from './store'

// заглушка для профиля
const ProfilePage = () => {
    return (
        <div>
            <h1>Профиль пользователя</h1>
            <p>Имя: User</p>
            <p>Email: @example.com</p>
            <p style={{ color: '#999' }}>Авторизация</p>
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

// защита маршрутов
const ProtectedRoute = ({ children }) => {
    const user = useAppSelector(state => state.auth.user)
    if (!user) {
        return <Navigate to="/login" replace />
    }
    return children
}

// обёртка для таблицы с проверкой документа
const SpreadsheetPage = () => {
    const { documentId } = useParams()
    const documents = useAppSelector(state => state.documents.list)
    const user = useAppSelector(state => state.auth.user)
    const doc = documents.find(d => d.id === documentId)
    if (doc && doc.userId !== user?.id) {
        return <Navigate to="/dashboard" replace />
    } if (!doc && documentId) {
        return <Navigate to="/404" replace />
    }  
    return <Table documentId={documentId} />
}

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/register',
        element: <RegisterPage />
    },
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