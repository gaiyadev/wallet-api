import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionRepository } from './repository/transaction.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
    user: User,
  ): Promise<any> {
    const transaction = await this.transactionRepository.createTransaction(
      createTransactionDto,
      user,
    );
    return {
      message: 'Charged Successful',
      status: 'Success',
      statusCode: 201,
      data: null,
    };
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
