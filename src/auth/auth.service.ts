import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.usersService.createUser(createUserDto);

      const fullName = `${newUser.firstName} ${newUser.lastName}`;

      const verificationCode = await this.generateEmailVerificationCode(
        newUser.id,
        newUser.email,
        newUser.role.name,
      );

      // Try sending the email verification code. If it fails, delete the user
      try {
        return this.emailService.sendEmailVerificationCode(
          newUser.email,
          fullName,
          verificationCode,
        );
      } catch (error) {
        this.prisma.users.delete({ where: { id: newUser.id } });
      }
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to create user. Please try again later.',
        );
      }
    }
  }

  async verifyEmail(verifyCodeDto: VerifyCodeDto) {
    try {
      const user = await this.usersService.findOne(verifyCodeDto.email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isMatch = await bcrypt.compare(
        verifyCodeDto.code,
        user.verificationCode,
      );

      if (isMatch) {
        const tokenValid = await this.validateToken(user.token);
        if (tokenValid.isValid) {
          // Change the status of email verification to true
          await this.prisma.users.update({
            where: { id: user.id },
            data: {
              emailVerified: true,
            },
          });

          this.emailService.sendAccountCreatedConfirmation(
            user.email,
            `${user.firstName} ${user.lastName}`,
          );

          return this.generateTokenAndUpdateUser({
            sub: user.id,
            email: user.email,
            role: user.role.name,
          });
        } else {
          throw new Error();
        }
      } else {
        throw new NotAcceptableException('verification code incorrect');
      }
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof NotAcceptableException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to verify reset code. Please try again later.',
        );
      }
    }
  }

  async signIn(email: string, pass: string): Promise<any> {
    try {
      // Find the user with the given email
      const user = await this.usersService.findOne(email);

      const passwordsMatch = await bcrypt.compare(pass, user.password);

      // Validate if the user exists and if passwords match using bcrypt
      if (!user || !passwordsMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate the JWT token with minimal user information
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role.name,
      };

      // Make the user active if it was deactivated
      await this.prisma.users.update({
        where: { email },
        data: {
          isActive: true,
        },
      });

      return this.generateTokenAndUpdateUser(payload);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to sign in. Please try again later.',
        );
      }
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const user = await this.usersService.findOne(forgotPasswordDto.email);

      if (!user) {
        throw new NotFoundException();
      }

      const fullName = `${user.firstName} ${user.lastName}`;
      const resetCode = await this.generatePasswordResetCode(
        user.id,
        user.email,
        user.role.name,
      );

      return this.emailService.sendPasswordResetCode(
        user.email,
        resetCode,
        fullName,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('A user with that email cannot be found');
      } else {
        throw new InternalServerErrorException(
          'Failed to send password reset code. Please try again later.',
        );
      }
    }
  }

  async verifyResetCode(verifyCodeDto: VerifyCodeDto) {
    try {
      const user = await this.usersService.findOne(verifyCodeDto.email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isMatch = await bcrypt.compare(verifyCodeDto.code, user.resetCode);

      if (isMatch) {
        return this.validateToken(user.token);
      } else {
        throw new NotAcceptableException('verification code incorrect');
      }
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof NotAcceptableException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to verify reset code. Please try again later.',
        );
      }
    }
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    try {
      // Check if the user exists
      const user = await this.prisma.users.findUnique({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException();
      }

      // Check if current password matches
      const passwordsMatch = await bcrypt.compare(
        updatePasswordDto.currentPassword,
        user.password,
      );
      if (!passwordsMatch) {
        throw new UnauthorizedException();
      }

      const hashedPassword = await bcrypt.hash(updatePasswordDto.password, 10);

      const updatedUser = await this.usersService.updatePassword(
        user.id,
        hashedPassword,
      );

      const fullName = `${updatedUser.firstName} ${updatedUser.lastName}`;

      this.emailService.sendPasswordChangeConfirmation(
        updatedUser.email,
        fullName,
      );

      return this.generateTokenAndUpdateUser({
        sub: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role.name,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(
          "A user with the specified id doesn't exist",
        );
      } else if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('The password is incorrect');
      } else {
        throw new InternalServerErrorException(
          'Failed to check password. Please try again later.',
        );
      }
    }
  }

  async resetPassword(email: string, newPassword: string) {
    try {
      const user = await this.usersService.findOne(email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatedUser = await this.usersService.updatePassword(
        user.id,
        hashedPassword,
      );

      const fullName = `${updatedUser.firstName} ${updatedUser.lastName}`;

      await this.emailService.sendPasswordChangeConfirmation(
        updatedUser.email,
        fullName,
      );

      // Reactivate the user account, if it was deactivated
      await this.prisma.users.update({
        where: { email },
        data: {
          isActive: true,
        },
      });

      return this.generateTokenAndUpdateUser({
        sub: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role.name,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Failed to reset password. Please try again later.',
        );
      }
    }
  }

  // A helper function to generate a JWT token and update user information
  // the function returns user data without sensitive information
  async generateTokenAndUpdateUser(payload: {
    sub: string;
    email: string;
    role: string;
  }) {
    try {
      const token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      });

      const updatedUser = await this.prisma.users.update({
        where: { id: payload.sub },
        data: {
          token: token,
          lastLoggedInAt: new Date(),
        },
        include: {
          role: true,
        },
      });

      const userWithoutSensitive =
        this.usersService.sanitizeUserData(updatedUser);

      return { ...userWithoutSensitive };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to generate token and update user. Please try again later.',
      );
    }
  }

  // A helper function to generate a password reset code
  async generatePasswordResetCode(userId: string, email: string, role: string) {
    try {
      const resetCode = randomBytes(3).toString('hex');

      const payload = {
        sub: userId,
        resetCode: resetCode,
        email: email,
        role: role,
      };

      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: process.env.JWT_SECRET,
      });

      const hashedResetCode = await bcrypt.hash(resetCode, 10);

      await this.usersService.updateUser(userId, {
        resetCode: hashedResetCode,
        token: token,
      });

      return resetCode;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to generate reset code. Please try again later.',
      );
    }
  }

  // A helper function to generate a email verification code
  async generateEmailVerificationCode(
    userId: string,
    email: string,
    role: string,
  ) {
    try {
      const verificationCode = randomBytes(3).toString('hex');

      const payload = {
        sub: userId,
        verificationCode: verificationCode,
        email: email,
        role: role,
      };

      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: process.env.JWT_SECRET,
      });

      const hashedVerificationCode = await bcrypt.hash(verificationCode, 10);

      await this.usersService.updateUser(userId, {
        verificationCode: hashedVerificationCode,
        token: token,
      });

      return verificationCode;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to generate email verification code. Please try again later.',
      );
    }
  }

  // A helper function to validate JWT tokens
  async validateToken(token: string) {
    try {
      // decode the token.
      const decodedToken = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      // convert milliseconds to seconds.
      const now = Date.now() / 1000;

      // token not expired.
      if (decodedToken.exp >= now) {
        return {
          isValid: true,
          token: token,
        };
      }
    } catch (error) {
      throw new RequestTimeoutException('token expired');
    }
  }
}
