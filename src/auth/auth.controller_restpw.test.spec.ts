import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            resetPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('resetPassword', () => {
    it('should call resetPassword method with correct parameters', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        email: 'test@example.com',
        newPassword: 'newPassword123',
      };

      const result = {
        message: 'Password reset successfully',
      };

      jest.spyOn(authService, 'resetPassword').mockResolvedValue(result);

      expect(await authController.resetPassword(resetPasswordDto)).toEqual(
        result,
      );
      expect(authService.resetPassword).toHaveBeenCalledWith(
        resetPasswordDto.email,
        resetPasswordDto.newPassword,
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        email: 'notfound@example.com',
        newPassword: 'newPassword123',
      };

      jest
        .spyOn(authService, 'resetPassword')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(
        authController.resetPassword(resetPasswordDto),
      ).rejects.toThrow(NotFoundException);
      expect(authService.resetPassword).toHaveBeenCalledWith(
        resetPasswordDto.email,
        resetPasswordDto.newPassword,
      );
    });

    it('should throw InternalServerErrorException for other errors', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        email: 'error@example.com',
        newPassword: 'newPassword123',
      };

      jest
        .spyOn(authService, 'resetPassword')
        .mockRejectedValue(
          new InternalServerErrorException('Failed to reset password'),
        );

      await expect(
        authController.resetPassword(resetPasswordDto),
      ).rejects.toThrow(InternalServerErrorException);
      expect(authService.resetPassword).toHaveBeenCalledWith(
        resetPasswordDto.email,
        resetPasswordDto.newPassword,
      );
    });
  });
});
