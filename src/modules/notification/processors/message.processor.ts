import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';

// Paylaşılan sözleşmeleri (contracts) import et
import {
  QueueNames,
  MessageFilteredJob,
  JobNames,
} from '@tssx-bilisim/praiven-contracts/queue';

import { Logger } from '@nestjs/common';
import { NotificationService } from '../notification.service';

/**
 * 'filter-queue'yu dinleyen "İnce" İşlemci (Thin Processor).
 * Gelen işleri alır ve 'FilterService'e delege eder.
 */
@Processor(QueueNames.MESSAGE_NOTIFICATION_QUEUE)
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(
    // Artık 'FilterProcessor' DEĞİL, 'FilterService'i enjekte ediyoruz
    private readonly notificationService: NotificationService,
  ) {
    super();
    this.logger.log(`[Worker] Listening to queue: ${QueueNames.MESSAGE_NOTIFICATION_QUEUE}`);
  }
  async process(job: Job) {
    switch (job.name) {
      case JobNames.MESSAGE_FILTERED:
        const data: MessageFilteredJob = job.data;
        await this.notificationService.emitMessageFiltered(data.userId, data);
        break;
    
      default:
        break;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`✅ Job ${job.id} completed `);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    this.logger.error(`❌ Job ${job.id} failed:`, err.message);
  }
}
