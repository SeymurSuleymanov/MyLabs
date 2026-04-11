// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // <-- СЛУШАТЬ ВСЕ IP-АДРЕСА (ЭТО ГЛАВНОЕ)
    allowedHosts: 'all', // <-- РАЗРЕШИТЬ ЛЮБЫЕ ХОСТЫ (ДЛЯ ПРОСТОТЫ)
    // port: 5173, // Порт можно оставить по умолчанию
  },
})