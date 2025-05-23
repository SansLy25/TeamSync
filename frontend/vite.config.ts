import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    target: 'esnext',
  },
  optimizeDeps: {
    include: ['lucide-react'],
  },
  server: {
    allowedHosts: true
  }
});
