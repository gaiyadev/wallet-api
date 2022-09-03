import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletRepository } from './repository/wallet.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { TransactionRepository } from '../transaction/repository/transaction.repository';
import { CreateTransactionDto } from '../transaction/dto/create-transaction.dto';
import { Transaction } from '../transaction/entities/transaction.entity';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { TransactionPurpose } from '../transaction/enums/transaction-purpose.enum';
import { TransactionType } from '../transaction/enums/transaction-type.enum';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletRepository)
    private readonly walletRepository: WalletRepository,

    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async create(createWalletDto: CreateWalletDto, user: User): Promise<any> {
    const wallet = await this.walletRepository.createWallet(
      createWalletDto,
      user,
    );
    return {
      message: 'Wallet Created successfully',
      status: 'Success',
      statusCode: 201,
      data: wallet.walletUuid,
    };
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    user: User,
  ): Promise<any> {
    const { transactionPurpose, transactionType, amount } =
      createTransactionDto;

    // Check for wallet existence
    const wallet = await this.walletRepository.findOne({ userId: user.id });
    if (!wallet) {
      throw new NotFoundException();
    }
    console.log(user.email);

    // Calling paystack charge api
    try {
      const charge = await axios.post(
        `${process.env['PAYSTACK_BASE_URL']}/charge`,
        {
          email: 'customer@email.com',
          amount: '10000',
          bank: {
            code: '057',
            account_number: '0000000000',
          },
          birthday: '1995-12-23',
        },
        {
          headers: {
            Authorization: `Bearer ${process.env['PAYSTACK_SECRET_KEY']}`,
          },
        },
      );
      if (charge.data.status === true) {
        return charge.data;
      } // const transaction = new Transaction();
      // transaction.transactionType = transactionType;
      // transaction.transactionPurpose = transactionPurpose;
      // transaction.amount = amount;
      // transaction.balanceBefore = Number(wallet.balance);
      // transaction.balanceAfter = Number(wallet.balance) + Number(amount);
      // transaction.wallet = user.wallet.id as any;
      // transaction.transactionReference = uuidv4();
      // const savedTransaction = await this.transactionRepository.save(
      //   transaction,
      // );
      // return {
      //   message: 'Charged Successful',
      //   status: 'Success',
      //   statusCode: 201,
      //   data: savedTransaction.transactionType,
      // };
    } catch (e) {
      throw new InternalServerErrorException('Something went wrong' + e);
    }
  }

  async addFund(reference: any, id: any) {
    const findWallet = await this.getWallet(id);
    if (!findWallet) {
      throw new NotFoundException('Wallet not found');
    }
    const verify = await this.verifyPayment(reference);
    console.log(verify);
    if (verify.data.status === 'success') {
      const createTransaction = await this.creatTransaction(
        TransactionPurpose.funding,
        TransactionType.Credit,
        verify.data.amount,
        id,
        id,
        'dsdsd',
      );
      if (!createTransaction) {
        throw new InternalServerErrorException('An error occurred');
      }
      return {
        message: 'Wallet Funded successfully',
        balance: '5600',
        status: 'Success',
        statusCode: 201,
      };
    }
  }

  async verifyPayment(reference: string) {
    const verifyTransaction = await axios.get(
      `${process.env['PAYSTACK_BASE_URL']}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env['PAYSTACK_SECRET_KEY']}`,
        },
      },
    );
    if (verifyTransaction.status === 200) {
      return verifyTransaction.data;
    }
  }

  async creatTransaction(
    transactionPurpose,
    transactionType,
    amount,
    wallet,
    user,
    transactionReference,
  ) {
    const transaction = new Transaction();
    transaction.transactionType = transactionType;
    transaction.transactionPurpose = transactionPurpose;
    transaction.amount = amount;
    transaction.balanceBefore = Number(wallet.balance);
    transaction.balanceAfter = Number(wallet.balance) + Number(amount);
    transaction.wallet = user.wallet.id as any;
    transaction.transactionReference = transactionReference;
    transaction.transactionUuid = uuidv4();
    return await this.transactionRepository.save(transaction);
  }

  async getWallet(id: number): Promise<any> {
    const found = await this.walletRepository.findOne({
      where: { userId: id },
    });
    if (!found) {
      throw new NotFoundException('Wallet not found');
    }
    return found;
  }

  findAll() {
    return `This action returns all wallet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
