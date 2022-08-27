import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repository/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

    private readonly jwtService: JwtService,
  ) {}

  /*
   *  Signup user
   */
  async signUp(signUpDto: SignUpDto): Promise<any> {
    const user = await this.userRepository.signUp(signUpDto);

    return {
      message: 'Account created successfully',
      status: 'Success',
      statusCode: 201,
      data: {
        userUuid: user.userUuid,
        email: user.email,
      },
    };
  }

  async signIn(signInDto: SignUpDto): Promise<any> {
    const user = await this.userRepository.signIn(signInDto);
    const { email, userUuid, id } = user;

    const payload = {
      email,
      userUuid,
      id,
    };

    const accessToken = this.jwtService.sign(payload);
    return {
      message: 'Login successfully',
      status: 'Success',
      statusCode: 200,
      accessToken,
      data: {
        userUuid: userUuid,
        email: email,
      },
    };
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
