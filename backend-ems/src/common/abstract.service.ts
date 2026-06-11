import { Injectable } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { PaginatedResult } from './paginated-result.interface';
import { Response } from 'express';
import * as ExcelJS from 'exceljs';
import { sanitizeColumn, sanitizeColumns, sanitizeSortDirection } from './sanitize.utils';

@Injectable()
export class AbstractService {
  constructor(protected readonly repository: Repository<any>) {}

  async findAll(relations: any[] = [], query): Promise<any[]> {
    const orderCol = query.direction ? sanitizeColumn(query.direction) : 'id';
    const order: Record<string, 'ASC' | 'DESC'> = {
      [orderCol]: sanitizeSortDirection(query.sort),
    };

    const where: any = query.field ? { [sanitizeColumn(query.field)]: query.keyword } : {};

    return this.repository.find({
      where: where,
      order: order,
      relations: relations,
    });
  }

  async paginate(tbl, relations, query): Promise<PaginatedResult> {
    const safeTbl = sanitizeColumn(tbl);
    const take: number = query.limit ? query.limit : 10;
    const page: number = query.page ? query.page : 1;
    const keyword: string = query.keyword ? query.keyword : '';
    const sortCol = query.direction ? sanitizeColumn(query.direction) : safeTbl + '.id';
    const sortDir = sanitizeSortDirection(query.sort);

    const myQuery = this.repository
      .createQueryBuilder(safeTbl)
      .where(safeTbl + '.id >=:id', { id: 0 })
      .andWhere(
        new Brackets((qb) => {
          const cols = query.column ? sanitizeColumns(query.column) : [];
          cols.map((col) => {
            qb.orWhere(col + ' like :keyword', {
              keyword: `%${keyword}%`,
            });
          });
        }),
      )
      .orderBy(sortCol, sortDir)
      .take(take)
      .skip((page - 1) * take);

    if (relations) {
      relations.map((relation) => {
        myQuery.leftJoinAndSelect(sanitizeColumn(relation[0]), sanitizeColumn(relation[1]));
      });
    }

    if (query.filterParams) {
      const objectArray = Object.entries(query.filterParams);
      objectArray.forEach(([key, value]) => {
        if (value != '') {
          const safeKey = sanitizeColumn(key);
          myQuery.andWhere(safeTbl + '.' + safeKey + ' =:' + safeKey, { [safeKey]: value });
        }
      });
    }

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

  async findOne(data: any, relations: any = []): Promise<any> {
    return this.repository.findOne({
      where: data,
      relations: relations,
    });
  }

  async update(id: any, data): Promise<any> {
    return this.repository.update(id, data);
  }

  async delete(id: any): Promise<any> {
    return this.repository.delete(id);
  }

  async remove(id: any): Promise<any> {
    return this.repository.delete(id);
  }

  async exportDataToExcel(data: any[], res: Response) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data Export');

    // Header Columns
    worksheet.columns = Object.keys(data[0]).map((key) => ({
      header: key.toUpperCase(),
      key: key,
      width: 15,
    }));

    // Insert Data Rows
    data.forEach((row) => {
      worksheet.addRow(row);
    });

    // Set Response Headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=data_export.xlsx',
    );

    // Write and Send Excel File
    await workbook.xlsx.write(res);
    res.end();
  }
}
