import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../common/decorators/authorization.decorator.js';
import { AuthorizedUser } from '../../common/types/authorized-user.js';

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        // @Roles() bo'lmasa, access beramiz
        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        const user = request.user as AuthorizedUser;

        if (!user || !user.roles) {
            return false;
        }


        const hasRole = requiredRoles.every(x => user.roles.includes(x));

        if (!hasRole) {
            throw new ForbiddenException('Insufficient role(s)');
        }

        return true;
    }
}