import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { HasPermission } from '../permissions/has-permission.decorator';
import { AuditService } from './audit.service';

@ApiTags('Audit Log')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionsGuard)
@Controller('audit-logs')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @ApiOperation({ summary: 'Mendapatkan log audit' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @Get()
  @HasPermission('audit')
  async findAll(@Req() req: Request) {
    return this.auditService.paginate(req.query);
  }
}
