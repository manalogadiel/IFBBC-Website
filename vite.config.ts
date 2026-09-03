import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { getLivestreamsData } from './src/server/livestreamService';

const livestreamApiPlugin = (): Plugin => ({
  name: 'livestream-api',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url && (req.url === '/api/livestreams' || req.url.startsWith('/api/livestreams?'))) {
        try {
          const data = await getLivestreamsData();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
          return;
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Failed to fetch livestreams' }));
          return;
        }
      }
      next();
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), livestreamApiPlugin()],
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
