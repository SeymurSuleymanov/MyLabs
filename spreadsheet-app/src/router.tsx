import { createBrowserRouter, Navigate, Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import AppLayout from './AppLayout'
import Dashboard from './components/Dashboard'
import Table from './components/Table'
import LoginPage from './services/LoginPage'
import RegisterPage from './services/RegisterPage'
import { authService } from './services/authService'
import { useAppSelector, useAppDispatch } from './store'
import { setUser } from './store'


const ProfilePage = () => {
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.auth.user)
    const documents = useAppSelector(state => state.documents.list)
    const [newName, setNewName] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [message, setMessage] = useState('')

    const handleChangeName = async () => {
        try {
            const result = await authService.changeName(user.id, newName)
            dispatch(setUser(result.user))
            setMessage('Имя изменено')
            setNewName('')
        } catch (err) {
            setMessage(err.message)
        }
    }

    const handleChangePassword = async () => {
        try {
            await authService.changePassword(user.id, oldPassword, newPassword)
            setMessage('Пароль изменён')
            setOldPassword('')
            setNewPassword('')
        } catch (err) {
            setMessage(err.message)
        }
    }

    return (
        <div style={{ maxWidth: '500px' }}>
            <h1>Профиль пользователя</h1>
            <p><strong>Имя:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Документов:</strong> {documents.length}</p>
            <p><strong>Дата регистрации:</strong> {user?.createdAt || '23.05.2026'}</p>
            
            <hr />
            <h3>Изменить имя</h3>
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Новое имя" />
            <button onClick={handleChangeName}>Сохранить</button>
            
            <hr />
            <h3>Сменить пароль</h3>
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Старый пароль" /><br />
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Новый пароль (мин. 8 символов)" /><br />
            <button onClick={handleChangePassword}>Сменить пароль</button>
            
            {message && <p style={{ color: 'green' }}>{message}</p>}
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