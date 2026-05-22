import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppDispatch } from '../store'
import { setUser, setTokens } from '../store'
import { authService } from '../services/authService'

const LoginPage = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        
        try {
            const data = await authService.login(email, password)
            dispatch(setUser(data.user))
            dispatch(setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken }))
            navigate('/dashboard')
        } catch (err) {
            setError('Неверный email или пароль')
        }
    }

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
            <h1>Вход</h1> {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                /><input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                /> <button type="submit" style={{ padding: '8px 16px' }}>Войти</button>
            </form>
            <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
        </div>
    )
}

export default LoginPage