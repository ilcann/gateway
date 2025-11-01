import { Module } from '@nestjs/common';
import { ProxyAuthController } from './proxy-auth.controller';
import { ProxyMessagesController } from './proxy-messages.controller';
import { ProxyConversationController } from './proxy-conversation.controller';

@Module({
  controllers: [ProxyAuthController, ProxyMessagesController, ProxyConversationController],
})
export class ProxyModule {}
