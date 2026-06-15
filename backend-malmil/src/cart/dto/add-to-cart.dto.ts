import { IsUUID, IsInt, Min, IsOptional } from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  variant_id: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
