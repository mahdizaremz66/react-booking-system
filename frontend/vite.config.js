import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:4000'
    }
  },
  build: {
    sourcemap: false
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['@emotion/react', '@emotion/styled', 'hoist-non-react-statics'],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
