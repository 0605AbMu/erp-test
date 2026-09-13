import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator.js';
import { AuthorizedUser } from '../../common/types/authorized-user.js';
import { authTokenVersionKey } from '../../common/utils/cache-keys.util.js';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    if (isPublic) {
      return true;
    }

    const result = await super.canActivate(context);

    if (!result) {
      return false;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user as AuthorizedUser;

    const key = authTokenVersionKey(user.id);

    const version = await this.cache.get(key);

    if (Number(version) !== user.tv) {
      throw new UnauthorizedException("token_version_mismatch");
    }
    return true;
  }

}
