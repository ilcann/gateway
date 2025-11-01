enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SYSTEM = 'SYSTEM',
}

interface AccessTokenPayload {
  sub: string; // user.id (string olarak)
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole; // "ADMIN" | "USER" | "SYSTEM"
  isSystem: boolean; // sistem kullanıcısı mı
}

interface RefreshTokenPayload {
  sub: string; // user.id
  jti: string; // refresh token id
}

export type { AccessTokenPayload, RefreshTokenPayload };
