import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => {
  const accessToken = {
    secret: process.env.JWT_SECRET || 'defaultSecretKey',
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY || '15m',
  };

  const refreshToken = {
    secret: process.env.JWT_REFRESH_SECRET || 'defaultRefreshSecretKey',
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d',
  };

  if (!accessToken.secret) {
    throw new Error('JWT_SECRET environment variable is not defined.');
  }
  if (!refreshToken.secret) {
    throw new Error(
      'JWT_REFRESH_SECRET environment variable is not defined for Refresh Token.',
    );
  }

  return {
    accessToken,
    refreshToken,
  };
});
