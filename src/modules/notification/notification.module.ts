import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QueueNames } from '@tssx-bilisim/praiven-contracts';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
import { NotificationProcessor } from './processors/message.processor';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueNames.MESSAGE_NOTIFICATION_QUEUE
    }),
    AuthModule
  ],
  providers: [NotificationGateway, NotificationService, NotificationProcessor]
})
export class NotificationModule {}
