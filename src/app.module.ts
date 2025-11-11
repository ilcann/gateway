import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProxyModule } from './modules/proxy/proxy.module';
import { appConfig } from './config/app.config';
import { servicesConfig } from './config/services.config';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { jwtConfig } from './config/jwt.config';
import { NotificationModule } from './modules/notification/notification.module';
import { BullModule } from '@nestjs/bullmq';
import { RedisConfig } from './config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, jwtConfig, servicesConfig],
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const redisConf = configService.get<RedisConfig>('redis');

        if (!redisConf) {
          throw new Error('Redis configuration is missing');
        }

        return {
          connection: {
            host: redisConf.host,
            port: redisConf.port,
            password: redisConf.password,
          },
        };
      },
      inject: [ConfigService],
    }),
    ProxyModule,
    AuthModule,
    NotificationModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
