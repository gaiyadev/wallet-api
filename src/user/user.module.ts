import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from './repository/user.repository';
import { UserJwtStrategy } from './jwt-strategies/user-jwt.strategy';
import { Wallet } from '../wallet/entities/wallet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, Wallet]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('EXPIRED_IN'),
        },
      }),
    }),
    ConfigModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserJwtStrategy],
  exports: [PassportModule, UserJwtStrategy],
})
export class UserModule {}
