import { Module } from '@nestjs/common';
import { AuthProxyController } from './auth.proxy.controller';
import { MessagesProxyController } from './messages.proxy.controller';
import { UsersProxyController } from './users.proxy.controller';

@Module({
  controllers: [AuthProxyController, MessagesProxyController, UsersProxyController],
})
export class ProxyModule {}
