import { TransactionType } from '../enums/transaction-type.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TransactionPurpose } from '../enums/transaction-purpose.enum';

export class CreateTransactionDto {
  @IsEnum(TransactionType, {
    message: `Value must be ${TransactionType.Credit} or ${TransactionType.Debit}`,
  })
  @IsNotEmpty()
  transactionType: TransactionType;

  @IsEnum(TransactionPurpose, {
    message: `Value must be ${TransactionPurpose.Transfer} or ${TransactionPurpose.Deposit} or ${TransactionPurpose.Reversal} or ${TransactionPurpose.funding}`,
  })
  @IsNotEmpty()
  transactionPurpose: TransactionPurpose;

  @IsNotEmpty()
  amount: number;
}
