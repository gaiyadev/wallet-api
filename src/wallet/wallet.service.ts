import {
  BadRequestException,
  ForbiddenException,
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
import { WalletTransferFund } from './dto/transfer-fund.dto';
import { Transfer } from './enums/transfer.enum';

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
    // const wallet = await this.walletRepository.findOne({ userId: user.id });
    // if (!wallet) {
    //   throw new NotFoundException('Wallet not found');
    // }
    // console.log(user.email);

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
      } 
    } catch (e) {
      throw new InternalServerErrorException('Something went wrong' + e);
    }
  }

  async addFund(reference: string, id: number) {
    const wallet = await this.walletRepository.findOne({where: {userId: id}})
    if (!wallet) {
      throw new NotFoundException('Wallet not found'!!);
    }
    const verify = await this.verifyPayment(reference);
    if (verify.data.status === 'success') {
      const paidAmount = Number(verify.data.amount) / 100
      wallet.balance = Number(wallet.balance) + paidAmount as any
      await this.walletRepository.save(wallet)

await this.creatTransaction({
     paidAmount: paidAmount,
    metaData: verify.data.authorization,
    reference: verify.data.reference, 
    transactionPurpose: TransactionPurpose.funding, 
    transactionType: TransactionType.Credit,
    wallet,
})
      // const transaction = new Transaction()
      // transaction.transactionType = TransactionType.Credit;
      // transaction.transactionPurpose = TransactionPurpose.funding;
      // transaction.amount = paidAmount;
      // transaction.balanceBefore = Number(wallet.balance);
      // transaction.balanceAfter = Number(wallet.balance) + paidAmount;
      // transaction.walletId = wallet.id as any;
      // transaction.transactionReference = verify.data.reference;
      // transaction.transactionUuid = uuidv4();
      // transaction.metaData = verify.data.authorization
      // await this.transactionRepository.save(transaction);
      return {
        message: 'Wallet Funded successfully',
        balance: wallet.balance,
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
    {transactionPurpose,
    transactionType,
    wallet,
    metaData,
    reference, paidAmount}
  ) {
    const transaction = new Transaction()
      transaction.transactionType = transactionType ;
      transaction.transactionPurpose =  transactionPurpose;
      transaction.amount = paidAmount;
      transaction.balanceBefore = Number(wallet.balance);
      transaction.balanceAfter = Number(wallet.balance) + paidAmount;
      transaction.walletId = wallet.id as any;
      transaction.transactionReference = reference;
      transaction.transactionUuid = uuidv4();
      transaction.metaData = metaData;
    return  await this.transactionRepository.save(transaction);
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

  async walletTransferFund(transferFund:WalletTransferFund, user: User ): Promise<any> {
      const {accountId, amount } = transferFund

      const wallet = await this.getWallet(user.id)
      if(!wallet) {
        throw new NotFoundException()
      }

      const account = await this.walletRepository.findOne({where: {walletId: accountId}})

      if(!account) {
        throw new BadRequestException('Account not found')

      }

      if(amount < wallet.balance) {
        throw new ForbiddenException('Insufficient found')
      }
     
      // Debiting the sender
      wallet.balance = Number(wallet.balance) - Number(amount) as any
      await this.walletRepository.save(wallet)

      // Crediting the recipient
      const paidAmount = Number(amount)
      account.balance = Number(account.balance) + paidAmount as any
      await this.walletRepository.save(wallet)

await this.creatTransaction({
     paidAmount: transferFund.amount,
    metaData: null,
    reference: account.walletId, 
    transactionPurpose: TransactionPurpose.Transfer, 
    transactionType: TransactionType.Debit,
    wallet,
})
    return {
      message: "Charge successfully",
      status: "Success",
      statusCode: 201,
      data: wallet.balance
    }
  }


  findAll() {
    return `This action returns all wallet`;
  }

 async findOne(id: number): Promise<any> {
    const wallet = await this.getWallet(id)
    return wallet
    
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
