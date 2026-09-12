import { Injectable } from '@nestjs/common';
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

  async validate(payload: {
    sub: number;
  }): Promise<AuthorizedUser> {
    return {
      id: payload.sub,
    };
  }
}