import { IsEnum, IsNotEmpty } from "class-validator";
import { Transfer } from "../enums/transfer.enum";

export class WalletTransferFund {
    @IsNotEmpty()
    amount: string

    @IsNotEmpty()
    accountId: string
}