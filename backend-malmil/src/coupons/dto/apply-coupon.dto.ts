import { IsString, IsOptional } from 'class-validator';

export class ApplyCouponDto {
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  session_id?: string;
}
