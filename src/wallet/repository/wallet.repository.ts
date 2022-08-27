import { EntityRepository, Repository } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { v4 as uuidv4 } from 'uuid';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from '../../user/entities/user.entity';

@EntityRepository(Wallet)
export class WalletRepository extends Repository<Wallet> {
  logger = new Logger('WalletRepository');
  async createWallet(createWalletDto: CreateWalletDto, user: User) {
    const { name } = createWalletDto;
    const found = await this.findOne({ userId: user.id });
    if (found) {
      throw new ConflictException('Already have a wallet');
    }
    try {
      const wallet = new Wallet();
      wallet.walletUuid = uuidv4();
      wallet.name = name;
      wallet.user = user;
      return wallet.save();
    } catch (err) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
