import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmConfigService } from './common/typeorm.service';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatarealModule } from './datareal/datareal.module';
import { DatalistModule } from './datalist/datalist.module';
import { SeedModule } from './database/seeders/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      imports: undefined,
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    UsersModule,
    RolesModule,
    PermissionsModule,
    AuthModule,
    DatarealModule,
    DatalistModule,
    SeedModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
