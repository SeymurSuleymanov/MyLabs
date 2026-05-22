import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppDispatch } from '../store'
import { setUser, setTokens } from '../store'
import { authService } from '../services/authService'

const RegisterPage = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Пароли не совпадают')
            return
        }
        if (password.length < 8) {
            setError('Пароль должен быть не менее 8 символов')
            return
        }

        try {
            const data = await authService.register(name, email, password)
            dispatch(setUser(data.user))
            dispatch(setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken }))
            navigate('/dashboard')
        } catch (err) {
            setError('Ошибка регистрации. Попробуйте другой email')
        }
    }

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
            <h1>Регистрация</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <input
                    type="password"
                    placeholder="Пароль (мин. 8 символов)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <input
                    type="password"
                    placeholder="Подтвердите пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <button type="submit" style={{ padding: '8px 16px' }}>Зарегистрироваться</button>
            </form>
            <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
        </div>
    )
}

export default RegisterPage