import { Module } from '@nestjs/common';
import { WalletTransactionService } from './wallet-transaction.service';
import { WalletTransactionController } from './wallet-transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletTransactionRepository } from './repository/wallet-transaction.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WalletTransactionRepository])],
  controllers: [WalletTransactionController],
  providers: [WalletTransactionService],
})
export class WalletTransactionModule {}
