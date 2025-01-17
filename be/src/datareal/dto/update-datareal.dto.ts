import { PartialType } from '@nestjs/mapped-types';
import { CreateDatarealDto } from './create-datareal.dto';

export class UpdateDatarealDto extends PartialType(CreateDatarealDto) {}
