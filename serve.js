/* serve.js — zero-dependency static server for local preview.
   node serve.js  →  http://localhost:4173
   (Deployment does NOT use this; GitHub Pages serves the files directly.) */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 4173;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
};

/* The webp set under assets/img/ was built by a temporary POST /__save endpoint
   that lived here plus a throwaway _convert.html page: this machine has no
   ffmpeg / ImageMagick / cwebp / Python, and the project bans dependencies, so
   the conversion ran in the browser's canvas and posted the results back. Both
   are removed again — see docs/HANDOFF.md §14 for how to bring them back when
   the next batch of screenshots arrives. */

http
  .createServer((req, res) => {
    const clean = decodeURIComponent(req.url.split("?")[0]);
    let file = path.join(ROOT, clean === "/" ? "index.html" : clean);
    // never serve outside the project folder
    if (!file.startsWith(ROOT)) { res.writeHead(403).end("forbidden"); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404, { "content-type": "text/plain" }).end("404 " + clean); return; }
      res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
      res.end(buf);
    });
  })
  .listen(PORT, () => console.log(`portfolio → http://localhost:${PORT}`));
