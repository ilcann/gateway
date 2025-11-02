import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenPayload, RequestUser } from '@tssx-bilisim/praiven-contracts/auth';

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
      roleId: payload.roleId,
      departmentId: payload.departmentId,
    });
  }
}
