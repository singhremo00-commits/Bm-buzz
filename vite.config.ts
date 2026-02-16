import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Ensures all assets are loaded relative to the deployment path
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: 'index.html', // Explicitly setting the entry HTML
    },
  },
  server: {
    port: 3000,
  }
});