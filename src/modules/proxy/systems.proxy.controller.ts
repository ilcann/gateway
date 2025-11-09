import { Controller, All, Req, Res, UseGuards, Get } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { createApiProxy } from './utils/proxy.factor';
import { ServicesConfig } from 'src/config/services.config';

@Controller('systems')
export class SystemsProxyController {
  private proxy: (req: Request, res: Response, next?: () => void) => void;

  constructor(private configService: ConfigService) {
    const services = this.configService.get<ServicesConfig>(
      'services',
    );

    if (!services) {
      throw new Error('Services configuration is missing');
    }

    console.log('Systems Service URL:', services.integration.url);
    
    this.proxy = createApiProxy({
      target: services.integration.url,
    });
  }

  @Get('proxy-health')
  checkHealth(@Req() req: Request, @Res() res: Response) {
    res.status(200).send('Systems Proxy is healthy');
  }

  @All(['', '/*'])
  proxySystems(@Req() req: Request, @Res() res: Response) {
    this.proxy(req, res);
  }
}
