
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures assets load correctly relative to the root
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  }
});
