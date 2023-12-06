import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/MSRM',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      }
    }
  },
  resolve: {
    alias: {
      "@": "/src",
      "@app": "/src/app",
      "@assets": "/src/assets",
      "@Pages": "/src/Pages",
      "@Widgets": "/src/Widgets",
      "@Features": "/src/Features",
      "@Entities": "/src/Entities",
      "@Shared": "/src/Shared",
      "@Hooks": "/src/Hooks",
      "@utils": "/src/utils",
    }
  }
})