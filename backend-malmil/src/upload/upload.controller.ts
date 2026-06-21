import { Controller, Post, Req, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { HasPermission } from '../permissions/has-permission.decorator';

@ApiTags('Upload')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionsGuard)
@Controller('upload')
export class UploadController {
  @ApiOperation({ summary: 'Mengunggah file' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @HasPermission('products')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return {
      url: `${baseUrl}/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
