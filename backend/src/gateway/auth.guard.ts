import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

let userId = 0;
let role = '';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const socket: Socket = context.switchToWs().getClient<Socket>();
    let token = socket.handshake.headers.access_token;
    if (!token) {
      console.log('No token');
      return false;
    }
    if (typeof token !== 'string') {
      console.log('token is not string');
      return false;
    }
    token = 'Bearer ' + token;
    try {
      const decoded = this.jwtService.verify(token.split(' ')[1]);
      console.log('decoded: ', decoded.sub, decoded.role);
      userId = decoded.sub;
      role = decoded.role;
      return true;
    } catch (err) {
      console.log('err: ', err);
      return false;
    }
  }
}

export function getUserId() {
  return {
    userID: userId,
    role: role,
  };
}
