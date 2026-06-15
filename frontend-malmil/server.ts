import 'zone.js/node';
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import bootstrap from './src/main.server';

const app = express();
const distFolder = join(process.cwd(), 'dist/fuse/browser');
const indexHtml = existsSync(join(distFolder, 'index.html'))
  ? join(distFolder, 'index.html')
  : join(distFolder, 'index.server.html');

const commonEngine = new CommonEngine();

app.set('view engine', 'html');
app.set('views', distFolder);

app.get(
  '*.*',
  express.static(distFolder, { maxAge: '1y' }) as any,
);

app.get('*', (req, res) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: distFolder,
      providers: [
        { provide: APP_BASE_HREF, useValue: baseUrl },
      ],
    })
    .then((html) => res.send(html))
    .catch((err) => {
      console.error('SSR error:', err);
      res.status(500).send('Internal Server Error');
    });
});

function run(): void {
  const port = parseInt(process.env['PORT'] || '4000', 10);
  app.listen(port, () => {
    console.log(`Angular SSR server running on http://localhost:${port}`);
  });
}

run();

export default app;
