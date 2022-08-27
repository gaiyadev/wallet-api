import { TransactionType } from '../enums/transaction-type.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TransactionPurpose } from '../enums/transaction-purpose.enum';

export class CreateTransactionDto {
  @IsEnum(TransactionType, {
    message: `Value must be ${TransactionType.Debit} or ${TransactionType.Credit}`,
  })
  @IsNotEmpty()
  transactionType: TransactionType;

  @IsEnum(TransactionPurpose, {
    message: `Value must be ${TransactionPurpose.Transfer} or ${TransactionType.Credit} or ${TransactionPurpose.Reversal}`,
  })
  @IsNotEmpty()
  transactionPurpose: TransactionPurpose;

  @IsNotEmpty()
  amount: number;
}
