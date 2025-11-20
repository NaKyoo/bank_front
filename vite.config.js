import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Proxy top-level API endpoints used by the frontend to the backend
      '/transfer': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/transactions': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/accounts': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/users': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
