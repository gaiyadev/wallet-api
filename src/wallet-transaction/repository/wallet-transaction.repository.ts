import { EntityRepository, Repository } from 'typeorm';
import { WalletTransaction } from '../entities/wallet-transaction.entity';

@EntityRepository(WalletTransaction)
export class WalletTransactionRepository extends Repository<WalletTransaction> {}
