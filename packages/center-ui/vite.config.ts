import { defineConfig } from 'vite'
import { join } from 'path'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
  plugins: [vue(), WindiCSS()],
  resolve: {
    alias: {
      src: join(__dirname, 'src'),
      app: __dirname
    }
  },
  build: {
    target: 'esnext'
  }
})
