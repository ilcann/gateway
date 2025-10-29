import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');

  app.setGlobalPrefix(appConfig!.globalPrefix);

  await app.listen(appConfig!.port, appConfig!.host);
  console.log(`Application "${appConfig!.name}" is running on: http://${appConfig!.host}:${appConfig!.port}/${appConfig!.globalPrefix}/`);
}
bootstrap();
