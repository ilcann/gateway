import { Controller, All, Req, Res, UseGuards, Get } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { createApiProxy } from './utils/proxy.factor';
import { ServicesConfig } from 'src/config/services.config';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersProxyController {
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

  @All(['', '/*'])
  proxyUsers(@Req() req: Request, @Res() res: Response) {
    this.proxy(req, res);
  }

  @Get('status')
  getStatus(@Req() req: Request, @Res() res: Response) {
    this.proxy(req, res);
  }
}