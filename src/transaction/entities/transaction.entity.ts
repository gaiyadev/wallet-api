import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionType } from '../enums/transaction-type.enum';
import { TransactionPurpose } from '../enums/transaction-purpose.enum';

@Entity('transactions')
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: number;

  @Column({
    nullable: false,
    type: 'uuid',
    name: 'transaction_reference',
    unique: true,
  })
  transactionReference: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: TransactionType,
    name: 'transaction_type',
  })
  transactionType: TransactionType;

  @Column({
    nullable: false,
    type: 'enum',
    enum: TransactionPurpose,
    name: 'transaction_purpose',
  })
  transactionPurpose: TransactionPurpose;

  @Column({ nullable: false, type: 'decimal' })
  amount: number;

  @Column({ nullable: false, type: 'decimal', name: 'balance_before' })
  balanceBefore: number;

  @Column({ nullable: false, type: 'decimal', name: 'balance_after' })
  balanceAfter: number;

  @Column({ nullable: false, type: 'jsonb', name: 'meta-data' })
  metaData: any;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
