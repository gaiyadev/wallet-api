import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import {
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { SignUpDto } from '../dto/sign-up.dto';
dotenv.config();

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  logger = new Logger('UserRepository');
  /*
   * Hashing Password
   * */
  private static async hashPassword(
    password: string,
    salt: string,
  ): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
  /*
   * Compare Password
   * */
  private static async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const { email, password } = signUpDto;

    // Generating salt or round for password hashing
    const saltOrRound = await bcrypt.genSalt(parseInt(process.env.GEN_SALT));

    // Creating new user
    try {
      const user = new User();
      user.userUuid = await uuidv4();
      user.email = email;
      user.password = await UserRepository.hashPassword(password, saltOrRound);
      return await user.save();
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Email address already taken.');
      } else {
        this.logger.error(`Something went wrong ${err.stack}`);
        throw new InternalServerErrorException('Something went wrong.');
      }
    }
  }

  async signIn(signinDto: SignUpDto) {
    const { email, password } = signinDto;

    const user = await this.findOne({ email: email });
    if (!user) {
      throw new ForbiddenException('Invalid Email or/and Password.');
    }

    const hashedPassword = user.password;
    const isMatch = await UserRepository.comparePassword(
      password,
      hashedPassword,
    );
    if (!isMatch) {
      throw new ForbiddenException('Invalid Email or/and Password.');
    }
    return user;
  }
}
