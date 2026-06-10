import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../../permissions/entities/permission.entity';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../users/entities/user.entity';
import { DatabaseSeeder } from './database-seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Role, User])],
  providers: [DatabaseSeeder],
})
export class SeedModule {}
