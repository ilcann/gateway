import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProxyModule } from './modules/proxy/proxy.module';
import { appConfig } from './config/app.config';
import { servicesConfig } from './config/services.config';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { jwtConfig } from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, jwtConfig, servicesConfig],
      isGlobal: true,
    }),
    ProxyModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
