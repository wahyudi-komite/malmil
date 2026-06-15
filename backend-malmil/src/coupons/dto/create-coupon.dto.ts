import { IsString, IsOptional, IsNumber, IsBoolean, IsDateString, Min, IsEnum } from 'class-validator';
import { CouponType } from '../entities/coupon.entity';

export class CreateCouponDto {
  @IsString()
  code: string;

  @IsEnum(CouponType)
  type: CouponType;

  @IsNumber()
  @Min(0)
  value: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  min_order?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  max_discount?: number;

  @IsNumber()
  @IsOptional()
  usage_limit?: number;

  @IsDateString()
  @IsOptional()
  starts_at?: string;

  @IsDateString()
  @IsOptional()
  expires_at?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
