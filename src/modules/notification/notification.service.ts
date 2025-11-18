import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { JobNames, LlmChunkJob, LlmDoneJob, MessageFilteredJob } from '@tssx-bilisim/praiven-contracts';

@Injectable()
export class NotificationService {
  constructor(private readonly gateway: NotificationGateway) {}

  async emitMessageFiltered(data: MessageFilteredJob) {
    this.gateway.sendToUser(data.userId, JobNames.MESSAGE_FILTERED, data);
  }

  async emitLlmStarted(data: { conversationId: string; userId: string; message: any }) {
    this.gateway.sendToUser(data.userId, JobNames.LLM_DRAFT_CREATED, data);
  }
  
  async emitLlmStream(data: LlmChunkJob) {
    this.gateway.sendToUser(data.userId, JobNames.LLM_STREAM, data);
  }

  async emitLlmDone(data: LlmDoneJob) {
    this.gateway.sendToUser(data.userId, JobNames.LLM_DONE, data);
  }
}