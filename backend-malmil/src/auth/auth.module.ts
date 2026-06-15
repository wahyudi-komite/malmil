import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordResetService } from './password-reset.service';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { CommonModule } from '../common/common.module';
import { MailModule } from '../mail/mail.module';
import { CsrfGuard } from './guards/csrf.guard';
import { RefreshToken } from './entities/refresh-token.entity';
import { PasswordReset } from './entities/password-reset.entity';
@Module({
  imports: [
    forwardRef(() => UsersModule),
    RolesModule,
    CommonModule,
    MailModule,
    TypeOrmModule.forFeature([RefreshToken, PasswordReset]),
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordResetService, CsrfGuard],
  exports: [AuthService],
})
export class AuthModule {}
