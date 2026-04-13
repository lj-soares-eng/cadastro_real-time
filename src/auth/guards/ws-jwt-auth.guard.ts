import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { WsException } from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import { AUTH_COOKIE_NAME, jwtSecret } from '../auth.constants';
import { parseCookieValue } from '../cookie.util';
import type { AccessTokenPayload } from '../strategies/jwt.strategy';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const token = parseCookieValue(
      client.handshake.headers.cookie,
      AUTH_COOKIE_NAME,
    );
    if (!token) {
      throw new WsException('Não autorizado');
    }
    try {
      const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(
        token,
        { secret: jwtSecret },
      );
      client.data.user = {
        userId: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role ?? Role.USER,
      };
      return true;
    } catch {
      throw new WsException('Não autorizado');
    }
  }
}
