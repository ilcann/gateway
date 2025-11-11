import { Logger, UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtAuthGuard } from '../auth/guards/ws-jwt-auth.guard';
import { CurrentUserWs, type RequestUser } from '@tssx-bilisim/praiven-contracts';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway()
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(NotificationGateway.name);
  constructor(private readonly authService: AuthService) {}
  
  afterInit() {
    console.log('ChatGateway initialized');
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    if (!token) {
      this.logger.warn(`Client connection rejected: Missing access token`);
      client.disconnect(true);
      return;
    }
    const user: RequestUser = await this.authService.validateAccessToken(token);

    await client.join(user.userId);
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const sockets = this.server.sockets.sockets;
    console.log(`Client disconnected: ${client.id}`);
    console.log(`Total connected clients: ${sockets.size}`);
  }

  sendToUser(userId: string, event: string, payload: any) {
    this.server.to(userId).emit(event, payload);
  }
}
