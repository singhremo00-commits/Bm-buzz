import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures assets load correctly relative to the root (important for Vercel/GitHub Pages)
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Ensure the entry point is correctly identified if needed, 
    // though Vite usually handles index.html automatically
  },
  server: {
    port: 3000,
  }
});