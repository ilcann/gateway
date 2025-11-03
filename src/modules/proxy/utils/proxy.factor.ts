import {
  createProxyMiddleware,
  fixRequestBody,
  Options,
} from 'http-proxy-middleware';
import { Request } from 'express';
import { RequestUser } from '@tssx-bilisim/praiven-contracts/auth';

// Fabrikamızın alacağı opsiyonlar
export interface ProxyFactoryOptions {
  target: string;
  pathRewrite?: { [key: string]: string };
}

/**
 * Tüm servisler için ortak mantığı içeren bir proxy ara yazılımı (middleware) oluşturur.
 * - 'x-user-*' başlıklarını ekler.
 * - CORS başlıklarını yönetir.
 * - Hata durumunu (error handling) yönetir.
 */
export function createApiProxy(options: ProxyFactoryOptions) {
  const { target, pathRewrite } = options;

  // Tüm proxy'lerin paylaşacağı ortak yapılandırma
  const commonConfig: Options = {
    target: target,
    changeOrigin: true,
    logger: console, // Geliştirme için loglamayı aç
    pathRewrite: pathRewrite, // Gelen pathRewrite'i uygula

    on: {
      /**
       * İstek aşağı akış servisine gönderilmeden hemen önce tetiklenir.
       */
      proxyReq(proxyReq, req: Request & { user?: RequestUser }) {
        // 1. Korumalı endpoint'ten gelen kullanıcıyı (Guard'dan) al
        if (req.user) {
          // 2. Downstream servislere güvenli başlıklar olarak ekle
          proxyReq.setHeader('x-user-id', req.user.userId);
          proxyReq.setHeader('x-user-roleid', req.user.roleId);
          proxyReq.setHeader('x-user-departmentid', req.user.departmentId);
        }
        
        // 3. Request body'sini düzelt
        fixRequestBody(proxyReq, req);
      },

      /**
       * Cevap istemciye geri gönderilmeden önce tetiklenir.
       */
      proxyRes(proxyRes, req: Request) {
        // 4. CORS başlıklarını dinamik olarak ayarla
        if (proxyRes.headers) {
          proxyRes.headers['access-control-allow-origin'] = req.headers.origin || '*';
          proxyRes.headers['access-control-allow-credentials'] = 'true';
        }
      },
    },
  };

  // Yapılandırılmış proxy middleware'ini döndür
  return createProxyMiddleware(commonConfig);
}