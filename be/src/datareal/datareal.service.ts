import { Injectable } from '@nestjs/common';
import { CreateDatarealDto } from './dto/create-datareal.dto';
import { UpdateDatarealDto } from './dto/update-datareal.dto';
import { AbstractService } from '../common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Datareal } from './entities/datareal.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DatarealService extends AbstractService {
  constructor(
    @InjectRepository(Datareal)
    private readonly _repository: Repository<Datareal>,
  ) {
    super(_repository);
  }
}
