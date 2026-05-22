import { Outlet, Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './store'
import { logout } from './store'

const AppLayout = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const location = useLocation()
    const { documentId } = useParams()
    const documents = useAppSelector(state => state.documents.list)
    const user = useAppSelector(state => state.auth.user)
    const currentDoc = documents.find(d => d.id === documentId)

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

    const getBreadcrumbs = () => {
        if (location.pathname === '/dashboard') {
            return <span>Мои документы</span>
        }
        if (location.pathname.includes('/documents/')) {
            return (
                <span>
                    <Link to="/dashboard">Мои документы</Link> → <span>{currentDoc?.title || 'Загрузка...'}</span>
                </span>
            )
        }
        if (location.pathname === '/profile') {
            return <span>Профиль</span>
        }
        return <span>Страница не найдена</span>
    }

    return (
        <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
            <div style={{ 
                background: '#f1f3f5', 
                padding: '15px 20px', 
                borderBottom: '1px solid #ccc',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <h2 style={{ margin: 0 }}>📊 Excel Online</h2>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <span>{user?.name || user?.email}</span>
                    <Link to="/dashboard">Документы</Link>
                    <Link to="/profile">Профиль</Link>
                    <button onClick={handleLogout} style={{ cursor: 'pointer' }}>Выйти</button>
                </div>
            </div>
            
            <div style={{ padding: '10px 20px', background: '#e9ecef', fontSize: '14px' }}>
                {getBreadcrumbs()}
            </div>
            
            <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
                <Outlet />
            </div>
        </div>
    )
}

export default AppLayout