import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Wallet } from '../../wallet/entities/wallet.entity';

@Entity('wallet_transactions')
export class WalletTransaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  walletId: number;

  @Column({ name: 'external_reference', type: 'varchar' })
  externalReference: string;

  @Column({ nullable: false, type: 'decimal' })
  amount: number;

  // @ManyToOne(() => Wallet, (wallets) => wallets.walletTransactions, {
  //   onDelete: 'CASCADE',
  // })
  // wallet: Wallet;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
