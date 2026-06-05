import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.config.get<string>('DATABASE_HOST'),
      port: 3306,
      username: this.config.get<string>('DATABASE_USERNAME'),
      password: this.config.get<string>('DATABASE_PASSWORD'),
      database: this.config.get<string>('DATABASE_NAME'),
      // entities: ['dist/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      logging:
        this.config.get<string>('DATABASE_DEBUG') === 'true' ? true : false,
      synchronize:
        this.config.get<string>('DATABASE_SYNCHRONIZE') === 'true'
          ? true
          : false,
    };
  }
}
