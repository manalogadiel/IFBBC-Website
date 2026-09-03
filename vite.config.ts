import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    watch: {
      usePolling: true,
      interval: 800,
      ignored: ['**/.agents/**', '**/dist/**', '**/node_modules/**', '**/*.mp4', '**/*.mov']
    }
  }
});
