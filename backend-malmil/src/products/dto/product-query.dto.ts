import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class ProductQueryDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;

  @IsOptional()
  @IsString()
  sort?: string; // 'price_asc', 'price_desc', 'newest', 'name_asc'
}
