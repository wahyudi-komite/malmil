import { Injectable } from '@nestjs/common';
import { AbstractService } from '../common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Datalist } from './entities/datalist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DatalistService extends AbstractService {
  constructor(
    @InjectRepository(Datalist)
    private readonly _repository: Repository<Datalist>,
  ) {
    super(_repository);
  }
}
