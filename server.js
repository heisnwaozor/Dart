import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { handleApiRequest } from './server/api.js';

const PORT = process.env.PORT || 5173;
const DIST_DIR = path.join(process.cwd(), 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  // Try API routes first
  if (req.url && req.url.startsWith('/api/')) {
    const handled = await handleApiRequest(req, res);
    if (handled) return;
  }

  // Serve static files from dist/ if built
  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url.split('?')[0]);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Dart Server Running</h1><p>API is active. Run "npm run build" to serve client assets.</p>');
  }
});

server.listen(PORT, () => {
  console.log(`Dart SQLite Server listening on http://localhost:${PORT}`);
});
