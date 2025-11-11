import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class WsJwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    return { headers: { authorization: client.handshake.auth?.token } };
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      const client = context.switchToWs().getClient();
      client.disconnect(true);
      return null;
    }
    // client.user’a Passport validate() çıktısını attach ediyoruz
    const client = context.switchToWs().getClient();
    client.user = user;
    return user;
  }
}