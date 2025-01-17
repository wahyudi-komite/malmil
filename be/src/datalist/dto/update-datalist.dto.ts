import { PartialType } from '@nestjs/mapped-types';
import { CreateDatalistDto } from './create-datalist.dto';

export class UpdateDatalistDto extends PartialType(CreateDatalistDto) {}
