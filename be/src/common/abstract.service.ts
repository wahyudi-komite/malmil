import { Injectable } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { PaginatedResult } from './paginated-result.interface';

@Injectable()
export class AbstractService {
  constructor(protected readonly repository: Repository<any>) {}

  async findAll(relations: any[] = [], query): Promise<any[]> {
    const order: any = {
      [query.direction ? query.direction : 'id']: query.sort
        ? query.sort.toUpperCase()
        : 'DESC',
    };

    const where: any = query.field ? { [query.field]: query.keyword } : {};

    return this.repository.find({
      where: where,
      order: order,
      relations: relations,
    });
  }

  async paginate(tbl, relations, query): Promise<PaginatedResult> {
    const take: number = query.limit ? query.limit : 10;
    const page: number = query.page ? query.page : 1;
    const keyword: string = query.keyword ? query.keyword : '';
    const direction: string = query.direction ? query.direction : tbl + '.id';
    const sortData = query.sort ? query.sort.toUpperCase() : 'DESC';

    const myQuery = this.repository
      .createQueryBuilder(tbl)
      .where(tbl + '.id >=:id', { id: 0 })
      .andWhere(
        new Brackets((qb) => {
          query.column.map((data) => {
            qb.orWhere(data + ' like :keyword', {
              keyword: `%${keyword}%`,
            });
          });
        }),
      )
      .orderBy(direction, sortData)
      .take(take)
      .skip((page - 1) * take);

    if (relations) {
      relations.map((relation) => {
        myQuery.leftJoinAndSelect(relation[0], relation[1]);
      });
    }

    if (query.filterParams) {
      const objectArray = Object.entries(query.filterParams);
      objectArray.forEach(([key, value]) => {
        if (value != '') {
          if (key == 'problem_date') {
            const start = new Date(value + ' 00:00:00');
            const end = new Date(value + ' 23:59:59');
            myQuery
              .andWhere(tbl + '.problem_date >= :start', { start: start })
              .andWhere(tbl + '.problem_date <= :end', { end: end });
          } else {
            myQuery.andWhere(tbl + '.' + key + ' =:' + key, { [key]: value });
          }
        }
      });
    }

    // if (query.column) {
    //   query.column.map((data) => {
    //     myQuery.orWhere(data + ' like :keyword', {
    //       keyword: `%${keyword}%`,
    //     });
    //   });
    // }
    const [data, total] = await myQuery.getManyAndCount();

    return {
      data: data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
        pageSize: take,
      },
    };
  }

  async create(data): Promise<any> {
    return this.repository.save(data);
  }

  async findOne(data: any, relations = []): Promise<any> {
    return this.repository.findOne({
      where: data,
      relations: relations,
    });
  }

  async update(id: number, data): Promise<any> {
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<any> {
    return this.repository.delete(id);
  }

  async remove(id: number): Promise<any> {
    return this.repository.delete(id);
  }
}
