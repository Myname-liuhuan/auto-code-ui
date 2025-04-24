import { fileURLToPath, URL } from 'node:url'
import { AppConfig } from './src/config'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  optimizeDeps: {
    exclude: ['vite-plugin-vue-devtools']
  },
  server: {
<<<<<<< HEAD
    port: AppConfig.port,
=======
    port: AppConfig.devPort,
>>>>>>> c7cfedbb211c9d4fdda2563dd4c6e79e6ee864f4
    proxy: {
      '/api': {
        target: AppConfig.targetUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})
