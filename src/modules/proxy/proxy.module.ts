import { Module } from '@nestjs/common';
import { AuthProxyController } from './auth.proxy.controller';
import { MessagesProxyController } from './messages.proxy.controller';

@Module({
  controllers: [AuthProxyController, MessagesProxyController],
})
export class ProxyModule {}
