import { IsOptional } from 'class-validator';

export class CreateWalletDto {
  @IsOptional()
  name: string;
}
