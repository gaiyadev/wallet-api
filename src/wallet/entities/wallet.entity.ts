import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { WalletTransaction } from '../../wallet-transaction/entities/wallet-transaction.entity';

@Entity('wallets')
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'uuid', name: 'wallet_uuid', unique: true })
  walletUuid: string;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: true, type: 'text' })
  name: string;

  @Column({ nullable: true, type: 'varchar', name: 'wallet_id' })
  walletId: string;

  @Column({ nullable: false, type: 'decimal', default: 0 })
  balance: string;

  @OneToOne(() => User, (user) => user.wallet, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => Transaction, (transactions) => transactions.wallet, {
    eager: true,
    onDelete: 'CASCADE',
  })
  transactions: Transaction[];

  @OneToMany(
    () => WalletTransaction,
    (walletTransactions) => walletTransactions.wallet,
    {
      eager: true,
      onDelete: 'CASCADE',
    },
  )
  walletTransactions: WalletTransaction[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
