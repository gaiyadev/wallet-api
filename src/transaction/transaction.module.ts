import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionRepository } from './repository/transaction.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionRepository])],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
