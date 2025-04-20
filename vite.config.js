import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, './src') }
    ]
  },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '',
          includePaths: ['node_modules']
        }
      }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Laravel backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});