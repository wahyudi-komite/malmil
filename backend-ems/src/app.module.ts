import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './common/typeorm.service';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatarealModule } from './datareal/datareal.module';
import { DatalistModule } from './datalist/datalist.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      imports: undefined,
    }),
    UsersModule,
    RolesModule,
    PermissionsModule,
    AuthModule,
    DatarealModule,
    DatalistModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
