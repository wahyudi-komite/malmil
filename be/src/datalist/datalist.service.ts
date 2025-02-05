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
    private _repository: Repository<Datalist>,
  ) {}

  async getAllData(): Promise<Datalist[]> {
    return this._repository.find();
  }

  async getPaginatedData(
    page: number,
    pageSize: number,
    sortField?: string,
    sortOrder?: 'ASC' | 'DESC',
  ) {
    const query = this._repository.createQueryBuilder('data');

    // Sorting jika ada parameter sorting dari frontend
    if (sortField && sortOrder) {
      query.orderBy(`data.${sortField}`, sortOrder);
    } else {
      query.orderBy('data.create', 'DESC'); // Default sorting
    }

    console.log(sortField + '' + sortOrder);

    const [data, total] = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    return { data, total };
  }
}
