import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccessTokenPayload, RequestUser } from '@tssx-bilisim/praiven-contracts/auth';

@Injectable()
export class AuthService {
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
}
