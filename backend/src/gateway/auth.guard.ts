import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Socket } from 'socket.io';

@Injectable()
export class AuthSocketGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean {
    const socket: Socket = context.switchToWs().getClient<Socket>();
    const token = socket.handshake.headers.access_token;
    if (!token) {
      return false;
    }
    return true;
  }
}
