import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    watch: {
      ignored: ['**/.agents/**', '**/dist/**', '**/node_modules/**', '**/public/**', '**/*.mp4', '**/*.mov']
    }
  }
});
