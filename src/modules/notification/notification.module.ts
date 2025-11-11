import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QueueNames } from '@tssx-bilisim/praiven-contracts';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueNames.NOTIFICATION_QUEUE
    }
    ),
  ]
})
export class NotificationModule {}
