import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { localDatabaseConfig } from '../ormconfig';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { WalletTransactionModule } from './wallet-transaction/wallet-transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(localDatabaseConfig),
    UserModule,
    WalletModule,
    TransactionModule,
    WalletTransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
