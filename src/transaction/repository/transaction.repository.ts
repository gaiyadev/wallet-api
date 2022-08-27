import { EntityRepository, Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { User } from '../../user/entities/user.entity';
import { InternalServerErrorException } from "@nestjs/common";

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
      return await transaction.save();
    } catch (e) {
      throw new InternalServerErrorException('Something went wrong')
    }
  }
}
