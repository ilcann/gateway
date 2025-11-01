import { Module } from '@nestjs/common';
import { ProxyAuthController } from './proxy-auth.controller';

@Module({
  controllers: [ProxyAuthController],
})
export class ProxyModule {}
