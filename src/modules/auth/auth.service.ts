import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayload, RequestUser } from '@tssx-bilisim/praiven-contracts/auth';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  /**
   * Validate an access token payload and return a RequestUser shape.
   * This is intentionally simple (maps claims) — extend with DB lookups if needed.
   */
  async validate(payload: AccessTokenPayload): Promise<RequestUser> {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid access token payload');
    }

    return {
      userId: payload.sub,
      roleId: payload.roleId,
      departmentId: payload.departmentId,
    };
  }

  /**
   * Verify a raw access token string and return the mapped RequestUser.
   * Throws UnauthorizedException when token is missing/invalid/expired.
   */
  async validateAccessToken(token: string): Promise<RequestUser> {
    if (!token) {
      throw new UnauthorizedException('Access token not provided');
    }

    // support "Bearer <token>" format
    const raw = token.replace(/^Bearer\s+/i, '');

    let payload: AccessTokenPayload;
    try {
      // JwtService.verify will throw if token is invalid or expired
      payload = this.jwtService.verify(raw) as AccessTokenPayload;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    return this.validate(payload);
  }
}
