import { registerAs } from '@nestjs/config';

/**
 * BullMQ ve diğer Redis istemcileri için
 * bağlantı ayarlarını tanımlar.
 */
export interface RedisConfig {
  host: string;
  port: number;
  password?: string; // Şifre genellikle opsiyoneldir (yerel geliştirmede)
  // db: number; // Birden fazla DB kullanıyorsanız bunu da ekleyebilirsiniz
}

export const redisConfig = registerAs('redis', (): RedisConfig => {
  // .env'den portu al, bulamazsan 6379'u varsay
  const port = parseInt(process.env.REDIS_PORT ?? '6379', 10);

  // .env'den host'u al, bulamazsan 'localhost'u varsay
  const host = process.env.REDIS_HOST || 'localhost';

  // .env'den şifreyi al. Eğer yoksa 'undefined' olur, bu da şifresiz bağlantı demektir.
  const password = process.env.REDIS_PASSWORD || undefined;

  return {
    host,
    port,
    password,
  };
});
