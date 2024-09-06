import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import {
  ApiForgotPasswordEndpoint,
  ApiRegisterEndpoint,
  ApiResetPasswordEndpoint,
  ApiSignInEndpoint,
  ApiUpdatePasswordEndpoint,
  ApiVerifyResetCodeEndpoint,
  ApiVerifyVerificationCodeEndpoint,
} from './docs/auth-controllers.doc';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiRegisterEndpoint()
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Post('verifyEmail')
  @ApiVerifyVerificationCodeEndpoint()
  verifyEmail(@Body() verifyCodeDto: VerifyCodeDto) {
    return this.authService.verifyEmail(verifyCodeDto);
  }

  @Public()
  @Post('signIn')
  @ApiSignInEndpoint()
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Public()
  @Post('forgotPassword')
  @ApiForgotPasswordEndpoint()
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Post('verifyResetCode')
  @ApiVerifyResetCodeEndpoint()
  verifyResetCode(@Body() verifyCodeDto: VerifyCodeDto) {
    return this.authService.verifyResetCode(verifyCodeDto);
  }

  @Post('updatePassword')
  @ApiUpdatePasswordEndpoint()
  updatePassword(
    @Req() req: Request,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const id = req['user'].sub;
    return this.authService.updatePassword(id, updatePasswordDto);
  }

  @Post('resetPassword')
  @ApiResetPasswordEndpoint()
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.newPassword,
    );
  }
}
