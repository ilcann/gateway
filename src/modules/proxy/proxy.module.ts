import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServicesConfig } from 'src/config/services.config';
import { createDynamicProxyMiddleware } from './proxy.middleware';

@Module({})
export class ProxyModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const services = this.configService.get<ServicesConfig>('services')!;

    if (!services) {
      console.error('⚠️ Services configuration missing');
      return;
    }

    consumer
      .apply(createDynamicProxyMiddleware(services))
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
