import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AccessTokenPayload, RequestUser } from '@tssx-bilisim/praiven-contracts/auth';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessToken.secret')!,
    });
  }

  validate(payload: AccessTokenPayload): Promise<RequestUser> {
    // Delegate to AuthService to centralize validation logic and future extension (DB lookups, caching)
    return this.authService.validate(payload);
  }
}
