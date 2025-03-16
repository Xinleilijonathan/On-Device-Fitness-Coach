import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,  // Frontend port
    proxy: {
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,
        changeOrigin: true
      },
      '/video_feed': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      },
      '/api': {
        target: 'http://127.0.0.1:5000/',
        changeOrigin: true
      },
      '/shutdown': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true
      }
    }
  }
})
