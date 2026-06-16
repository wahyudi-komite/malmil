import { IsUUID, IsInt, Min } from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  variant_id: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
