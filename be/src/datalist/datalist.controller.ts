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
} from '@nestjs/common';
import { DatalistService } from './datalist.service';
import { CreateDatalistDto } from './dto/create-datalist.dto';
import { UpdateDatalistDto } from './dto/update-datalist.dto';
import { Datalist } from './entities/datalist.entity';
import { formatDate } from '../utils/date.utils';

const tables = 'm_data15m';

@Controller('datalist')
export class DatalistController {
  constructor(private readonly _service: DatalistService) {}

  @Get()
  async findAll(@Request() request) {
    const returnData = await this._service.paginate(tables, [], {
      limit: request.query.limit,
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
}
