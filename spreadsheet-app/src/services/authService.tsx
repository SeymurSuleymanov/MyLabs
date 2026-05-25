const USERS_KEY = 'app_users'

const getUsers = () => {
    const stored = localStorage.getItem(USERS_KEY)
    if (stored) return JSON.parse(stored)
    return [{ id: '1', name: 'Admin', email: 'admin@example.com', password: '12345678' }]
}

const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const authService = {
    async login(email, password) {
        const users = getUsers()
        const user = users.find(u => u.email === email && u.password === password)
        
        if (!user) {
            throw new Error('Неверный email или пароль')
        }
        
        return {
            user: { id: user.id, name: user.name, email: user.email },
            accessToken: 'fake-token-' + Date.now(),
            refreshToken: 'fake-refresh-' + Date.now()
        }
    },

    async register(name, email, password) {
        const users = getUsers()
        const existing = users.find(u => u.email === email)
        
        if (existing) {
            throw new Error('Email уже зарегистрирован')
        }
        
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password
        }
        
        users.push(newUser)
        saveUsers(users)
        
        return {
            user: { id: newUser.id, name: newUser.name, email: newUser.email },
            accessToken: 'fake-token-' + Date.now(),
            refreshToken: 'fake-refresh-' + Date.now()
        }
    },
    
    async refreshToken(refreshToken) {
        return {
            accessToken: 'new-fake-token-' + Date.now()
        }
    },

    async changeName(userId, newName) {
        const users = getUsers()
        const user = users.find(u => u.id === userId)
        if (!user) throw new Error('Пользователь не найден')
        
        user.name = newName
        saveUsers(users)
        return { user: { id: user.id, name: user.name, email: user.email } }
    },

    async changePassword(userId, oldPassword, newPassword) {
        const users = getUsers()
        const user = users.find(u => u.id === userId)
        if (!user) throw new Error('Пользователь не найден')
        if (user.password !== oldPassword) throw new Error('Неверный старый пароль')
        if (newPassword.length < 8) throw new Error('Новый пароль должен быть не менее 8 символов')
        
        user.password = newPassword
        saveUsers(users)
        return { success: true }
    }
}