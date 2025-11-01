import { All, Controller, Get, Next, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import { ServicesConfig } from "src/config/services.config";
import type { Request, Response } from 'express';
import { AuthGuard } from "@nestjs/passport";
import { RequestUser } from "../auth/interfaces/request-user";
import { AccessTokenPayload } from "../auth/interfaces/jwt-payload.interface";

@UseGuards(AuthGuard('jwt'))
@Controller("/messages")
export class ProxyMessagesController {
  private proxy: any;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const servicesConfig = this.configService.get<ServicesConfig>("services");
    if (!servicesConfig) console.error("Services configuration is undefined");

    const messageService = servicesConfig!.message;
    const target = messageService!.url;
    if (!target) {
      throw new Error(`"${messageService!.name}" service URL is not defined. Skipping proxy setup.`);
    }

    this.proxy = createProxyMiddleware({
      target,
      changeOrigin: true,
      logger: console,
      on: {
        proxyRes(proxyRes, req:Request & { user: RequestUser }, res:Response) {
          if (req.user) {
            proxyRes.headers['x-user-id'] = req.user.userId.toString();
            proxyRes.headers['x-user-role'] = req.user.role.toString();
            proxyRes.headers['x-user-is-system'] = req.user.isSystem.toString();
          }

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
  getStatus(@Req() req: Request & { user: RequestUser }) {
    console.log(`User ${req.user?.userId} accessed messages proxy status`);
    return { status: 'conversation proxy is ok' };
  }

  @All('*path')
  proxyRequests(@Req() req: Request, @Res() res: Response, @Next() next) {
    return this.proxy(req, res, next);
  }
}