import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: false, // Do not clear the popup/background build
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content/index.tsx')
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        format: 'iife'
      }
    }
  }
});
