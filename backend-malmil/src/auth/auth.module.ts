import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { CommonModule } from '../common/common.module';
import { CsrfGuard } from './guards/csrf.guard';
import { RefreshToken } from './entities/refresh-token.entity';
@Module({
  imports: [forwardRef(() => UsersModule), RolesModule, CommonModule, TypeOrmModule.forFeature([RefreshToken])],
  controllers: [AuthController],
  providers: [AuthService, CsrfGuard],
  exports: [AuthService],
})
export class AuthModule {}
