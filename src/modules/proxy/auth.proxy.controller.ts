import { Controller, All, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { createApiProxy } from './utils/proxy.factor';
import { ServicesConfig } from 'src/config/services.config';

@Controller('auth')
export class AuthProxyController {
  private proxy: (req: Request, res: Response, next?: () => void) => void;

  constructor(private configService: ConfigService) {
    const services = this.configService.get<ServicesConfig>(
      'services',
    );

    if (!services) {
      throw new Error('Services configuration is missing');
    }
    
    this.proxy = createApiProxy({
      target: services.auth.url,
    });
  }

  @All('*')
  proxyMessages(@Req() req: Request, @Res() res: Response) {
    this.proxy(req, res);
  }
}