import { IsString, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  address_id: string;

  @IsString()
  @IsNotEmpty()
  courier_code: string;

  @IsString()
  @IsNotEmpty()
  courier_service: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  coupon_code?: string;

  @IsOptional()
  @IsString()
  guest_name?: string;

  @IsOptional()
  @IsString()
  guest_email?: string;

  @IsOptional()
  @IsString()
  guest_phone?: string;
}
