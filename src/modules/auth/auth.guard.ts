import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DECORATOR_PUBLIC } from 'src/shared/decorators/public.decorator';
import { inspect } from 'util';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      if (this.isPublicRoute(context)) {
        return true;
      }
      const req = context.switchToHttp().getRequest();
      const token =
        req?.cookies?.accessToken || req?.signedCookies?.accessToken;

      const tokenPayload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString(),
      );

      req.userEmail = tokenPayload.email;

      await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow('JWT_SECRET'),
      });

      const user = await this.authService.findAdminUserByEmail(
        tokenPayload.email,
      );

      if (!user) {
        throw new ForbiddenException(
          'Користувач більше не має доступу до системи',
        );
      }

      return true;
    } catch (e) {
      this.logger.error(inspect(e));
      return false;
    }
  }

  private isPublicRoute(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(DECORATOR_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
