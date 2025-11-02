import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ProxyAuthController } from './proxy-auth.controller';
import { ConfigService } from '@nestjs/config';
import { ServicesConfig } from 'src/config/services.config';
import { createProxyMiddlewareFactory } from './proxy.middleware';

@Module({})
export class ProxyModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const servicesConfig = this.configService.get<ServicesConfig>("services");

    if (!servicesConfig) console.error("Services configuration is undefined");

    const ProxyMessageService = createProxyMiddlewareFactory(servicesConfig!.message.url, 
      servicesConfig!.message.paths || [],
    );
    consumer
      .apply(ProxyMessageService)
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    const ProxyAuthService = createProxyMiddlewareFactory(servicesConfig!.auth.url,
      servicesConfig!.auth.paths || [],
    );
    consumer
      .apply(ProxyAuthService)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
