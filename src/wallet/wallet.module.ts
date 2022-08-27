import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletRepository } from './repository/wallet.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WalletRepository])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
