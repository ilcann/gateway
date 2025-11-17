import { Controller, All, Req, Res, Get } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { createApiProxy } from './utils/proxy.factor';
import { ServicesConfig } from 'src/config/services.config';

@Controller('llm-metrics')
export class LlmMetricsProxyController {
  private proxy: (req: Request, res: Response, next?: () => void) => void;

  constructor(private configService: ConfigService) {
    const services = this.configService.get<ServicesConfig>(
      'services',
    );

    if (!services) {
      throw new Error('Services configuration is missing');
    }

    this.proxy = createApiProxy({
      target: services.metrics?.url,
    });
  }

  @Get('proxy-health')
  checkHealth(@Req() req: Request, @Res() res: Response) {
    res.status(200).send('LLM Metrics Proxy is healthy');
  }

  @All(['', '/*'])
  proxyMetrics(@Req() req: Request, @Res() res: Response) {
    this.proxy(req, res);
  }
}
