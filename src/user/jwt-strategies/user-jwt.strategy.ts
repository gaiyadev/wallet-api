import { PassportStrategy } from '@nestjs/passport';
import { UserRepository } from '../repository/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload): Promise<User> {
    const { id } = payload;
    const user = await this.userRepository.findOne({ id: id });
    if (!user) {
      throw new UnauthorizedException('Unauthorized Access.78');
    }
    return user;
  }
}
