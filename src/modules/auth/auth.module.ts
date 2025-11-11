import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.accessToken.secret')!,
        // cast expiresIn to any to avoid strict typing differences; value should be string or number like '1h' or 3600
        signOptions: { expiresIn: (configService.get('jwt.accessToken.expiresIn') as any) || '1h' },
      }),
    }),
  ],
  providers: [JwtStrategy, AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
