import { IsString, IsArray, IsNumber, IsOptional, Min } from 'class-validator';

export class CalculateRateDto {
  @IsString()
  destination: string;

  @IsNumber()
  @Min(1)
  weight: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  couriers?: string[];
}
