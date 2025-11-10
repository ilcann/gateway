import { Controller, All, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { createApiProxy } from './utils/proxy.factor';
import { ServicesConfig } from 'src/config/services.config';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('conversations')
export class ConversationsProxyController {
  private proxy: (req: Request, res: Response, next?: () => void) => void;

  constructor(private configService: ConfigService) {
    const services = this.configService.get<ServicesConfig>(
      'services',
    );

    if (!services) {
      throw new Error('Services configuration is missing');
    }
    
    this.proxy = createApiProxy({
      target: services.conversations.url,
    });
  }

  @All(['', '/*'])
  proxyConversations(@Req() req: Request, @Res() res: Response) {
    this.proxy(req, res);
  }
}
