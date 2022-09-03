import { IsEnum, IsNotEmpty } from "class-validator";
import { Transfer } from "../enums/transfer.enum";

export class TransferFund {
    @IsEnum(Transfer)
    @IsNotEmpty()
    to: Transfer
}