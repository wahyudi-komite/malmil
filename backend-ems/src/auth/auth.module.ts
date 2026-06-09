import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { CommonModule } from '../common/common.module';
import { CsrfGuard } from './guards/csrf.guard';
@Module({
  imports: [forwardRef(() => UsersModule), CommonModule],
  controllers: [AuthController],
  providers: [AuthService, CsrfGuard],
  exports: [AuthService],
})
export class AuthModule {}
