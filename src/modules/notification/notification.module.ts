import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QueueNames } from '@tssx-bilisim/praiven-contracts';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueNames.MESSAGE_NOTIFICATION_QUEUE
    }),
  ],
  providers: [NotificationGateway, NotificationService]
})
export class NotificationModule {}
