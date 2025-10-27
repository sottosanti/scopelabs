import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://take-home-assessment-423502.uc.r.appspot.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
