import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import {
  NotFoundException,
  UnauthorizedException,
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
            updatePassword: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('updatePassword', () => {
    it('should call updatePassword method with correct parameters', async () => {
      const req = { user: { sub: 'user-id' } } as any;
      const updatePasswordDto: UpdatePasswordDto = {
        currentPassword: 'currentPassword123',
        password: 'newPassword123',
      };

      const result = {
        message: 'Password updated successfully',
      };

      jest.spyOn(authService, 'updatePassword').mockResolvedValue(result);

      expect(
        await authController.updatePassword(req, updatePasswordDto),
      ).toEqual(result);
      expect(authService.updatePassword).toHaveBeenCalledWith(
        req.user.sub,
        updatePasswordDto,
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      const req = { user: { sub: 'user-id' } } as any;
      const updatePasswordDto: UpdatePasswordDto = {
        currentPassword: 'currentPassword123',
        password: 'newPassword123',
      };

      jest
        .spyOn(authService, 'updatePassword')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(
        authController.updatePassword(req, updatePasswordDto),
      ).rejects.toThrow(NotFoundException);
      expect(authService.updatePassword).toHaveBeenCalledWith(
        req.user.sub,
        updatePasswordDto,
      );
    });

    it('should throw UnauthorizedException if current password is incorrect', async () => {
      const req = { user: { sub: 'user-id' } } as any;
      const updatePasswordDto: UpdatePasswordDto = {
        currentPassword: 'wrongCurrentPassword',
        password: 'newPassword123',
      };

      jest
        .spyOn(authService, 'updatePassword')
        .mockRejectedValue(
          new UnauthorizedException('The password is incorrect'),
        );

      await expect(
        authController.updatePassword(req, updatePasswordDto),
      ).rejects.toThrow(UnauthorizedException);
      expect(authService.updatePassword).toHaveBeenCalledWith(
        req.user.sub,
        updatePasswordDto,
      );
    });

    it('should throw InternalServerErrorException for other errors', async () => {
      const req = { user: { sub: 'user-id' } } as any;
      const updatePasswordDto: UpdatePasswordDto = {
        currentPassword: 'currentPassword123',
        password: 'newPassword123',
      };

      jest
        .spyOn(authService, 'updatePassword')
        .mockRejectedValue(
          new InternalServerErrorException('Failed to update password'),
        );

      await expect(
        authController.updatePassword(req, updatePasswordDto),
      ).rejects.toThrow(InternalServerErrorException);
      expect(authService.updatePassword).toHaveBeenCalledWith(
        req.user.sub,
        updatePasswordDto,
      );
    });
  });
});
