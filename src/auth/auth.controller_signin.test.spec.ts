import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

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
            signIn: jest.fn().mockImplementation((email, password) => {
              if (!email) {
                throw { response: { message: 'Email is required' } };
              }
              if (!password) {
                throw { response: { message: 'Password is required' } };
              }
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                throw { response: { message: 'Invalid Email format' } };
              }
              if (email !== 'validemail@test.com') {
                throw { response: { message: 'Email not found' } };
              }
              if (password !== 'validpassword') {
                throw { response: { message: 'Incorrect password' } };
              }
              return { token: 'mockToken' };
            }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signIn', () => {
    it.each`
      email                    | password           | expectedErrorMessage
      ${''}                    | ${'password'}      | ${'Email is required'}
      ${'test'}                | ${'password'}      | ${'Invalid Email format'}
      ${'test@test'}           | ${'password'}      | ${'Invalid Email format'}
      ${'test@test.com'}       | ${''}              | ${'Password is required'}
      ${'test@test.com'}       | ${'password'}      | ${'Email not found'}
      ${'validemail@test.com'} | ${'validpassword'} | ${null}
    `(
      'should return expected error message for $email and $password',
      async ({ email, password, expectedErrorMessage }) => {
        const signInDto: SignInDto = { email, password };
        try {
          const result = await authController.signIn(signInDto);
          expect(result).toEqual({ token: 'mockToken' });
          expect(expectedErrorMessage).toBeNull();
        } catch (error) {
          expect(error.response.message).toEqual(expectedErrorMessage);
        }
      },
    );

    it('should return a token for valid credentials', async () => {
      const signInDto: SignInDto = {
        email: 'validemail@test.com',
        password: 'validpassword',
      };
      const result = await authController.signIn(signInDto);

      expect(result).toEqual({ token: 'mockToken' });
    });

    it('should handle errors', async () => {
      jest
        .spyOn(authService, 'signIn')
        .mockRejectedValue(new Error('Invalid credentials'));
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      await expect(authController.signIn(signInDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });
});
