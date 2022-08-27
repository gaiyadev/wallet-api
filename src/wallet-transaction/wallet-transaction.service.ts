import { Injectable } from '@nestjs/common';
import { CreateWalletTransactionDto } from './dto/create-wallet-transaction.dto';
import { UpdateWalletTransactionDto } from './dto/update-wallet-transaction.dto';
import { WalletTransactionRepository } from './repository/wallet-transaction.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WalletTransactionService {
  constructor(
    @InjectRepository(WalletTransactionRepository)
    private readonly walletTransactionRepository: WalletTransactionRepository,
  ) {}
  create(createWalletTransactionDto: CreateWalletTransactionDto) {
    return 'This action adds a new walletTransaction';
  }

  findAll() {
    return `This action returns all walletTransaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} walletTransaction`;
  }

  update(id: number, updateWalletTransactionDto: UpdateWalletTransactionDto) {
    return `This action updates a #${id} walletTransaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} walletTransaction`;
  }
}
