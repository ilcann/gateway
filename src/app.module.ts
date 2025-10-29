import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ProxyModule } from './proxy/proxy.module';
import { appConfig } from './config/app.config';
import { servicesConfig } from './config/services.config';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration, appConfig, servicesConfig],
      isGlobal: true,
    }),
    ProxyModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
