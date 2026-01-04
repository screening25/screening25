import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),                           // @: src 디렉토리에 접근
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),              // @assets: src/assets 디렉토리에 접근
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),      // @components: src/components 디렉토리에 접근
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),                // @pages: src/pages 디렉토리에 접근
      '@types': fileURLToPath(new URL('./src/types', import.meta.url)),                // @types: src/types 디렉토리에 접근
      '@recoil': fileURLToPath(new URL('./src/recoil', import.meta.url)),              // @recoil: src/recoil 디렉토리에 접근
      '@apis': fileURLToPath(new URL('./src/apis', import.meta.url)),                  // @apis: src/apis 디렉토리에 접근
    }
  },

  // SCSS 전역 사용 
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/main.scss" as *;`
      }
    }
  }
})
