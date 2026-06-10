import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { HasPermission } from './has-permission.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionsGuard } from './permissions.guard';

@UseGuards(AuthGuard, PermissionsGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @HasPermission('permissions')
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get('all')
  @HasPermission('permissions')
  async all(@Request() request) {
    return this.permissionsService.findAll([], {
      sort: request.query.sort,
      direction: request.query.direction,
    });
  }

  @Get()
  @HasPermission('permissions')
  async findAll(@Request() request) {
    return this.permissionsService.paginate('permissions', [], {
      limit: request.query.limit,
      page: request.query.page,
      sort: request.query.sort,
      direction: request.query.direction,
      keyword: request.query.keyword,
      column: ['name'],
    });
  }

  @Get(':id')
  @HasPermission('permissions')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Put(':id')
  @HasPermission('permissions')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @HasPermission('permissions')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }

  @Post('findName')
  @HasPermission('permissions')
  get(@Body('name') name: string) {
    return this.permissionsService.findOne({ name });
  }
}
