import { registerAs } from '@nestjs/config';

export interface AppConfig {
  env: string; // Örneğin 'development', 'production', 'test'
  port: number; // Uygulamanın çalışacağı port
  host: string; // Uygulamanın host adresi
  name: string; // Uygulama adı
  globalPrefix: string; // Opsiyonel: Global API prefix
}

export const appConfig = registerAs('app', (): AppConfig => {
  const port = parseInt(process.env.PORT ?? '5001', 10);
  const host = process.env.HOST || '0.0.0.0';
  const name = process.env.APP_NAME || 'Gateway Service';
  const env = process.env.NODE_ENV || 'development';
  const globalPrefix = process.env.GLOBAL_PREFIX || 'api';

  return {
    env,
    port,
    host,
    name,
    globalPrefix,
  };
});
