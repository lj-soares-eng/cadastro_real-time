import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { WsException } from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import { ROLES_KEY } from '../roles.decorator';

@Injectable()
export class WsRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) {
      return true;
    }
    const client = context.switchToWs().getClient<Socket>();
    const user = client.data?.user as { role?: Role } | undefined;
    if (!user?.role || !roles.includes(user.role)) {
      throw new WsException('Proibido');
    }
    return true;
  }
}
