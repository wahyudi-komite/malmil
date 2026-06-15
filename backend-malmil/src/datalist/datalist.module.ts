import { Module } from '@nestjs/common';
import { DatalistService } from './datalist.service';
import { DatalistController } from './datalist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Datalist } from './entities/datalist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Datalist])],
  controllers: [DatalistController],
  providers: [DatalistService],
  exports: [DatalistService],
})
export class DatalistModule {}
