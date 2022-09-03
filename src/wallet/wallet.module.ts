import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletRepository } from './repository/wallet.repository';
import { TransactionRepository } from '../transaction/repository/transaction.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletRepository, TransactionRepository]),
  ],
  controllers: [WalletController],
  providers: [WalletService, UserModule],
})
export class WalletModule {}
