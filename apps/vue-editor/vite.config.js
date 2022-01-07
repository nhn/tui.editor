import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue'
import path from 'path';
export default defineConfig({
  entry: './src/index.js',
  plugins: [ vue() ],
  server: {
    port: 8080
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      }
    ]
  },
  build: {
    chunkSizeWarningLimit: 600,
    cssCodeSplit: false
  }
});