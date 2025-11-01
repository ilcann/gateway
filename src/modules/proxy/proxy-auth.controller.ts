import { All, Controller, Get, Next, Req, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import { ServicesConfig } from "src/config/services.config";
import type { Request, Response } from 'express';

@Controller("/auth")
export class ProxyAuthController {
  private proxy: any;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const servicesConfig = this.configService.get<ServicesConfig>("services");
    if (!servicesConfig) console.error("Services configuration is undefined");

    const authService = servicesConfig!.auth;
    const target = authService!.url;
    if (!target) {
      throw new Error(`"${authService!.name}" service URL is not defined. Skipping proxy setup.`);
    }

    this.proxy = createProxyMiddleware({
      target,
      changeOrigin: true,
      logger: console,
      on: {
        proxyRes(proxyRes, req:Request, res:Response) {
          if (proxyRes.headers) {
            proxyRes.headers['access-control-allow-origin'] = req.headers.origin || '*';
            proxyRes.headers['access-control-allow-credentials'] = 'true';
          }
        },
        proxyReq: fixRequestBody,
      },
    });
  }

  @Get('status')
  getStatus() {
    return { status: 'auth proxy is ok' };
  }

  @All('*path')
  proxyRequests(@Req() req: Request, @Res() res: Response, @Next() next) {
    return this.proxy(req, res, next);
  }
}