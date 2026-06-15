import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuid } from 'uuid';
import { UploadController } from './upload.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (_req, file, cb) => {
          const name = uuid();
          const ext = extname(file.originalname);
          cb(null, `${name}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
    CommonModule,
  ],
  controllers: [UploadController],
  providers: [],
  exports: [],
})
export class UploadModule {}
