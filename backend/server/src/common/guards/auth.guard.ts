import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthRepo } from '@modules/auth/auth.repo';
import { Reflector } from '@nestjs/core';
import { GUEST_ROLE } from '@common/decorators/roles.decorator';
import { ARCHIVED_RESOURCE_ACCESS } from '@common/decorators/archived-resource.decorator';
import { RoleSlug } from '@common/constants';
import { AuthService } from '@modules/auth/auth.service';
import { UserService } from '@modules/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authRepo: AuthRepo,
    private reflector: Reflector,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const GuestRolePermission =
      this.reflector.get<object>(GUEST_ROLE, context.getHandler()) || false;
    const isArchivedResource =
      this.reflector.get<object>(
        ARCHIVED_RESOURCE_ACCESS,
        context.getHandler(),
      ) || false;

    const userId = request.headers['x-client-id'];
    if (isArchivedResource && !userId)
      throw new HttpException('Invalid user', HttpStatus.UNAUTHORIZED);

    if (!userId && GuestRolePermission) return true;
    if (!userId && !GuestRolePermission)
      throw new HttpException('Invalid user', HttpStatus.UNAUTHORIZED);

    const keyStore = await this.authRepo.findKeyTokenByUserId(userId);
    if (!keyStore)
      throw new HttpException('Not found Key', HttpStatus.NOT_FOUND);

    if (request.headers['x-refresh-token']) {
      try {
        const refreshToken = request.headers['x-refresh-token'];
        const decodeUser = await this.verifyJwt(
          refreshToken,
          keyStore.refresh_key,
        );
        if (userId != decodeUser.sub)
          throw new HttpException('Invalid user', HttpStatus.UNAUTHORIZED);
        request.keyStore = keyStore;
        request.user = decodeUser;
        request.refreshToken = refreshToken;
        return true;
      } catch (error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    // const accessToken = request.headers['authorization'];
    const accessToken = this.extractTokenFromHeader(request);
    if (!accessToken) throw new UnauthorizedException();
    try {
      const decodeUser = await this.verifyJwt(accessToken, keyStore.public_key);
      if (userId != decodeUser.sub)
        throw new HttpException('Invalid user', HttpStatus.UNAUTHORIZED);

      if (isArchivedResource) {
        const roleSlug = await this.userService.getRoleSlugOfUser(
          decodeUser.sub,
        );
        if (!(roleSlug == RoleSlug.ADMIN)) {
          throw new HttpException(
            'You do not have permission to access this resource.',
            HttpStatus.UNAUTHORIZED,
          );
        }
      }
      request.keyStore = keyStore;
      request.user = decodeUser;
      return true;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async verifyJwt(token: string, keySecret: string): Promise<any> {
    return await this.jwtService.verifyAsync(token, { secret: keySecret });
  }
}
