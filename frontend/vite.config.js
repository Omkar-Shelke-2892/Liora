import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/chat": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
      "/get-questions": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
      "/submit-answers": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      }
    }
  }
})
