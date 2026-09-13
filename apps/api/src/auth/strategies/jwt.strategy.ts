import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../config/config.service.js';
import { AuthorizedUser } from '../../common/types/authorized-user.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwtSecret.secret,
    });
  }

  private readonly logger = new Logger(JwtStrategy.name);

  async validate(payload: {
    sub: number;
    exp: number;
    roles: string[];
    tv: number
  }): Promise<AuthorizedUser> {

    const user = {
      id: Number(payload.sub),
      exp: payload.exp,
      roles: payload.roles,
      tv: payload.tv
    };

    this.logger.debug('Authorized User ', user)

    return user;
  }
}