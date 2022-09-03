import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repository/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Wallet } from '../wallet/entities/wallet.entity';
import { v4 as uuidv4 } from 'uuid';
import { walletIdentity } from '../wallet/untils/wallet-identity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

    private readonly jwtService: JwtService,

    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  /*
   *  Signup user
   */
  async signUp(signUpDto: SignUpDto): Promise<any> {
    const user = await this.userRepository.signUp(signUpDto);

    const wallet = new Wallet();
    wallet.walletUuid = uuidv4();
    wallet.userId = user.id as any;
    wallet.walletId = (await walletIdentity()) as any;
    await this.walletRepository.save(wallet);

    return {
      message: 'Account created successfully',
      status: 'Success',
      statusCode: 201,
      data: {
        userUuid: user.userUuid,
        email: user.email,
        id: user.id,
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
        id: user.id,
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
