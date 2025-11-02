import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import type { Request, Response, NextFunction } from 'express';
import { RequestUser } from 'src/modules/auth/interfaces/request-user';

export function createProxyMiddlewareFactory(target: string, paths: string[]) {
  @Injectable()
  class CustomProxyMiddleware implements NestMiddleware {
    proxy: any;

    constructor() {
      this.proxy = createProxyMiddleware({
        target,
        changeOrigin: true,
        logger: console,
        on: {
          proxyReq(proxyReq, req: Request & { user?: RequestUser }) {
            if (req.user) {
              proxyReq.setHeader('x-user-id', req.user.userId);
              proxyReq.setHeader('x-user-role', req.user.role);
              proxyReq.setHeader('x-user-is-system', req.user.isSystem.toString());
            }
            fixRequestBody(proxyReq, req);
          },
          proxyRes(proxyRes, req: Request) {
            if (proxyRes.headers) {
              proxyRes.headers['access-control-allow-origin'] = req.headers.origin || '*';
              proxyRes.headers['access-control-allow-credentials'] = 'true';
            }
          },
        },
      });
    }

    use(req: Request, res: Response, next: NextFunction) {
      if (paths.some(p => req.path.startsWith(p))) {
        return this.proxy(req, res, next);
      }
      next();
    }
  }

  return CustomProxyMiddleware;
}