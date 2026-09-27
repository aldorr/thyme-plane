import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 600
  },
  css: {
    preprocessorOptions: {
      scss: {
        // quiet Sass deprecation noise from Bulma/Buefy during migration
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function']
      }
    }
  }
})
