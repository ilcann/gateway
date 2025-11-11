import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QueueNames } from '@tssx-bilisim/praiven-contracts';
import { NotificationGateway } from './notification.gateway';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueNames.NOTIFICATION_QUEUE
    }),
  ],
  providers: [NotificationGateway]
})
export class NotificationModule {}
