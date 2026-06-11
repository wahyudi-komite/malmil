import { Controller, Get, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { DatalistService } from './datalist.service';
import { formatDate } from '../utils/date.utils';

const tables = 'm_data15m';

@Controller('datalist')
export class DatalistController {
  constructor(private readonly _service: DatalistService) {}

  /**
   * Fungsi untuk mengambil data dengan filter, sorting, dan pagination.
   */
  private async getData(request, isExport = false): Promise<any> {
    const filterParams: Record<string, any> = {};
    if (request.query.start) filterParams.start = request.query.start;
    if (request.query.end) filterParams.end = request.query.end;
    if (request.query.rw) filterParams.rw = request.query.rw;
    if (request.query.yw) filterParams.yw = request.query.yw;
    if (request.query.timeJobFrom) filterParams.timeJobFrom = request.query.timeJobFrom;
    if (request.query.timeJobTo) filterParams.timeJobTo = request.query.timeJobTo;

    const returnData = await this._service.paginate(tables, [], {
      limit: isExport ? 100000 : request.query.limit,
      page: request.query.page,
      sort: request.query.sort,
      direction: request.query.direction,
      keyword: request.query.keyword,
      filterParams,
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

    // Format tanggal sebelum dikembalikan
    returnData.data = returnData.data.map((item) => ({
      ...item,
      create: formatDate(new Date(item.create)),
      timejob: formatDate(new Date(item.timejob)),
    }));

    return returnData;
  }

  /**
   * Endpoint untuk mendapatkan data dengan pagination
   */
  @Get()
  async findAll(@Request() request) {
    return await this.getData(request);
  }

  /**
   * Endpoint untuk export data ke Excel
   */
  @Get('excel')
  async exportExcel(@Res() res: Response, @Request() request) {
    const returnData = await this.getData(request, true);
    await this._service.exportDataToExcel(returnData.data, res);
  }
}
