import { IsNotEmpty, MinLength } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  @MinLength(4)
  name: string;
}
