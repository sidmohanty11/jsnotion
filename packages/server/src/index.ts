import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { createCellsRouter } from './routes/cell';

export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  const app = express();

  app.use(createCellsRouter(filename, dir));

  if (useProxy) {
    app.use(
      createProxyMiddleware({
        target: 'http://localhost:3000',
        ws: true,
        logLevel: 'silent',
      })
    );
  } else {
    try {
      const pkgPath = require.resolve('@jssnippets/client/build/index.html');
      app.use(express.static(path.dirname(pkgPath)));
    } catch (err) {
      console.log(err);
    }
  }

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error', reject);
  });
};
