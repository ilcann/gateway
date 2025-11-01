import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenPayload } from '../interfaces/jwt-payload.interface';
import { RequestUser } from '../interfaces/request-user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessToken.secret')!,
    });
  }

  validate(payload: AccessTokenPayload): Promise<RequestUser> {
    return Promise.resolve({
      userId: payload.sub,
      role: payload.role,
      isSystem: payload.isSystem,
    });
  }
}
