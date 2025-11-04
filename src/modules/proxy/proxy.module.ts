import { Module } from '@nestjs/common';
import { AuthProxyController } from './auth.proxy.controller';
import { MessagesProxyController } from './messages.proxy.controller';
import { UsersProxyController } from './users.proxy.controller';
import { ExternalSystemsProxyController } from './external-systems.proxy.controller';
import { PoliciesProxyController } from './policies.proxy.controller';

@Module({
  controllers: [
    AuthProxyController,
    MessagesProxyController,
    UsersProxyController,
    ExternalSystemsProxyController,
    PoliciesProxyController,
  ],
})
export class ProxyModule {}
