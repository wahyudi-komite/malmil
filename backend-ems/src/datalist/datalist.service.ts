import { Injectable } from '@nestjs/common';
import { CreateDatalistDto } from './dto/create-datalist.dto';
import { UpdateDatalistDto } from './dto/update-datalist.dto';
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
