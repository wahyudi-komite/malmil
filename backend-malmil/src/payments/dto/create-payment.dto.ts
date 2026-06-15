import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  order_id: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  customer_details?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}
