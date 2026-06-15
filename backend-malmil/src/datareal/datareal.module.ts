import { Module } from '@nestjs/common';
import { DatarealService } from './datareal.service';
import { DatarealController } from './datareal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Datareal } from './entities/datareal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Datareal])],
  controllers: [DatarealController],
  providers: [DatarealService],
  exports: [DatarealService],
})
export class DatarealModule {}
