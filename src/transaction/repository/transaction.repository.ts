import { EntityRepository, Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { User } from '../../user/entities/user.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    user: User,
  ): Promise<Transaction> {
    const { transactionPurpose, transactionType, amount } =
      createTransactionDto;
    try {
      const transaction = new Transaction();
      transaction.transactionType = transactionType;
      transaction.transactionPurpose = transactionPurpose;
      transaction.amount = amount;
      transaction.wallet = user.wallet.id as any;
      transaction.transactionReference = uuidv4();
      return await transaction.save();
    } catch (e) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
