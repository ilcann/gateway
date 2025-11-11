import { UseGuards } from '@nestjs/common';
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

@WebSocketGateway({ namespace: '/notifications' })
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  afterInit() {
    console.log('ChatGateway initialized');
  }

  @UseGuards(WsJwtAuthGuard) // Burada guard kullanıyoruz
  async handleConnection(@CurrentUserWs() user: RequestUser, client: Socket) {
    // guard başarılıysa client.user Passport strategy validate() çıktısını içerir
    client.data = { user };
    await client.join(user.userId);

    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const sockets = this.server.sockets.sockets;
    console.log(`Client disconnected: ${client.id}`);
    console.log(`Total connected clients: ${sockets.size}`);
  }
}
