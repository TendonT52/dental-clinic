import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { AuthSocketGuard } from './auth.guard';
import { Socket } from 'socket.io';

export const ROLES_KEY = 'roles';

@Injectable()
export class RolesSocketGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const socket: Socket = context.switchToWs().getClient<Socket>();
    const token = socket.handshake.headers.access_token;
    console.log('token: ', token);
    throw new ForbiddenException("You don't have permission to access");
  }
}

export function AuthSocket(...roles: Role[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(AuthSocketGuard, RolesSocketGuard),
  );
}
