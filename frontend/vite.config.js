import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/static/vue/',
  build: {
    assetsInlineLimit: 0,
    outDir: '../static/vue',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (asset) => asset.names?.some(name => ['index.css', 'sensin-logo.png'].includes(name))
          ? 'assets/[name][extname]' : 'assets/[name]-[hash][extname]',
      },
    },
  },
})
