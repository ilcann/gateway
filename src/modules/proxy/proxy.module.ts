import { Module } from '@nestjs/common';
import { AuthProxyController } from './auth.proxy.controller';
import { MessagesProxyController } from './messages.proxy.controller';
import { UsersProxyController } from './users.proxy.controller';
import { ExternalSystemsProxyController } from './external-systems.proxy.controller';

@Module({
  controllers: [AuthProxyController, MessagesProxyController, UsersProxyController, ExternalSystemsProxyController],
})
export class ProxyModule {}
