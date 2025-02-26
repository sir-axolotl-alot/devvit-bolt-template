import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'game.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css' || assetInfo.name === 'index.css') {
            return 'game.css';
          }
          return '[name].[ext]';
        },
      },
    },
    assetsInlineLimit: 0,
    assetsDir: '.',
    cssCodeSplit: false,
  },
});