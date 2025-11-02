import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { ServicesConfig } from 'src/config/services.config';
import { RequestUser } from 'src/modules/auth/interfaces/request-user';

export function createDynamicProxyMiddleware(servicesConfig: ServicesConfig) {
  const proxies = Object.values(servicesConfig)
    .filter(s => s.paths && s.paths.length)
    .map(service => ({
      target: service.url,
      paths: service.paths!,
      proxy: createProxyMiddleware({
        target: service.url,
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
      }),
    }));

  return (req: Request, res: Response, next: NextFunction) => {
    const matched = proxies.find(p => p.paths.some(path => req.path.startsWith(path)));
    if (matched) {
      return matched.proxy(req, res, next);
    }
    next();
  };
}
