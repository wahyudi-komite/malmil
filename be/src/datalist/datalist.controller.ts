import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { DatalistService } from './datalist.service';
import { CreateDatalistDto } from './dto/create-datalist.dto';
import { UpdateDatalistDto } from './dto/update-datalist.dto';
import { Datalist } from './entities/datalist.entity';
import { formatDate } from '../utils/date.utils';
import * as ExcelJS from 'exceljs';

const tables = 'm_data15m';

@Controller('datalist')
export class DatalistController {
  constructor(private readonly _service: DatalistService) {}

  @Get()
  async findAll(@Request() request) {
    const returnData = await this._service.paginate(tables, [], {
      limit: request.query.limit,
      // limit: 88,
      page: request.query.page,
      sort: request.query.sort,
      direction: request.query.direction,
      keyword: request.query.keyword,
      column: [
        tables + '.id',
        tables + '.create',
        tables + '.timejob',
        tables + '.rw_volt',
        tables + '.yw_volt',
        tables + '.bw_volt',
        tables + '.ry_volt',
        tables + '.yb_volt',
        tables + '.br_volt',
        tables + '.r_ampere',
        tables + '.y_ampere',
        tables + '.b_ampere',
        tables + '.w_ampere',
        tables + '.wh_powerrecv',
        tables + '.active_power',
        tables + '.apparent_power',
        tables + '.reactive_power',
        tables + '.power_factor',
        tables + '.freq',
        tables + '.hd1_temp',
        tables + '.hd1_hum',
        tables + '.hd2_temp',
        tables + '.hd2_hum',
        tables + '.hd3_temp',
        tables + '.hd3_hum',
        tables + '.line_run',
        tables + '.plan_prod',
        tables + '.target_prod',
        tables + '.act_prod',
      ],
    });

    returnData.data = returnData.data.map((item) => ({
      ...item,
      create: formatDate(new Date(item.create)),
      timejob: formatDate(new Date(item.timejob)),
    }));

    return returnData;
  }

  @Get('excel')
  async exportExcel(@Res() res: Response) {
    console.log(1);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Tambahkan kolom
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nama', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
    ];

    // Tambahkan data contoh
    worksheet.addRow({ id: 1, name: 'John Doe', email: 'john@example.com' });
    worksheet.addRow({ id: 2, name: 'Jane Doe', email: 'jane@example.com' });

    // Pastikan header benar
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename="data.xlsx"');

    // Stream workbook langsung ke response
    const buffer = await workbook.xlsx.writeBuffer();
    res.end(buffer);
  }
}
