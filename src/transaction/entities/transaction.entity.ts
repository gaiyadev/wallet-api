import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionType } from '../enums/transaction-type.enum';
import { TransactionPurpose } from '../enums/transaction-purpose.enum';
import { Wallet } from '../../wallet/entities/wallet.entity';

@Entity('transactions')
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  walletId: number;

  @Column({
    nullable: false,
    type: 'varchar',
    name: 'transaction_reference',
    unique: true,
  })
  transactionReference: string;

  @Column({
    nullable: false,
    type: 'varchar',
    name: 'transaction_uuid',
    unique: true,
  })
  transactionUuid: string;

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

  @ManyToOne(() => Wallet, (wallets) => wallets.transactions, {
    onDelete: 'CASCADE',
  })
  wallet: Wallet;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
