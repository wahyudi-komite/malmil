import { Injectable } from '@nestjs/common';
import { CreateDatalistDto } from './dto/create-datalist.dto';
import { UpdateDatalistDto } from './dto/update-datalist.dto';
import { AbstractService } from '../common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Datalist } from './entities/datalist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DatalistService {
  // constructor(
  //   @InjectRepository(Datalist)
  //   private readonly _repository: Repository<Datalist>,
  // ) {
  //   super(_repository);
  // }

  constructor(
    @InjectRepository(Datalist)
    private userRepository: Repository<Datalist>,
  ) {}

  async getAllData(): Promise<Datalist[]> {
    return this.userRepository.find();
  }
}
