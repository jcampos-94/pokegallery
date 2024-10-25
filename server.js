const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  // Strip the query string from the URL (e.g., ?id=25)
  const reqUrl = req.url.split('?')[0];

  // Handle requests for static files like HTML, CSS, JS
  let filePath = '.' + reqUrl;

  if (filePath === './') {
    // Serve index.html
    filePath = './index.html';
  }

  if (filePath === './detailed/') {
    // Serve index.html
    filePath = './detailed/index.html';
  }

  if (filePath === './favorites/') {
    // Serve index.html
    filePath = './favorites/index.html';
  }

  // Get file extension
  const extname = String(path.extname(filePath)).toLowerCase();
  
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.mjs': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code == 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('404 - File not found', 'utf-8');
      } else {
        res.writeHead(500);
        res.end('500 - Internal server error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
