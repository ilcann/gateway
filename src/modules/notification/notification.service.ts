import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { JobNames, MessageFilteredJob } from '@tssx-bilisim/praiven-contracts';

@Injectable()
export class NotificationService {
  constructor(private readonly gateway: NotificationGateway) {}

  async emitMessageFiltered(userId: string, data: MessageFilteredJob) {
    this.gateway.sendToUser(userId, JobNames.MESSAGE_FILTERED, data);
  }
}