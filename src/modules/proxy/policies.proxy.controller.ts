import { Controller, All, Req, Res, UseGuards, Get } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { createApiProxy } from './utils/proxy.factor';
import { ServicesConfig } from 'src/config/services.config';

@Controller('policies')
export class PoliciesProxyController {
  private proxy: (req: Request, res: Response, next?: () => void) => void;

  constructor(private configService: ConfigService) {
    const services = this.configService.get<ServicesConfig>(
      'services',
    );

    if (!services) {
      throw new Error('Services configuration is missing');
    }

    this.proxy = createApiProxy({
      target: services.filter.url,
    });
  }

  @Get('proxy-health')
  checkHealth(@Req() req: Request, @Res() res: Response) {
    res.status(200).send('External Systems Proxy is healthy');
  }

  @All(['', '/*'])
  proxyMessages(@Req() req: Request, @Res() res: Response) {
    this.proxy(req, res);
  }
}