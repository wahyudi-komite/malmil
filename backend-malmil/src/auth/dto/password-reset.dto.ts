import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  password: string;
}

export class VerifyEmailDto {
  @IsNotEmpty()
  token: string;
}

export class SendVerificationDto {
  @IsNotEmpty()
  userId: string;
}
