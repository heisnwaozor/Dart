import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { handleApiRequest } from './server/api.js';

function databaseApiPlugin(): Plugin {
  return {
    name: 'database-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          try {
            const handled = await handleApiRequest(req, res);
            if (!handled) {
              next();
            }
          } catch (err) {
            console.error('Database API Middleware Error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: String(err) }));
          }
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), databaseApiPlugin()],
});
