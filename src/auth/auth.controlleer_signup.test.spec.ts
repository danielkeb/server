import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

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
            register: jest
              .fn()
              .mockImplementation((createUserDto: CreateUserDto) => {
                const { email, username, password } = createUserDto;
                if (!email || !username || !password) {
                  throw { response: { message: 'Validation failed' } };
                }
                if (email === 'test@test.com') {
                  throw { response: { message: 'Email already exists' } };
                }
                return { id: 'mockId', ...createUserDto };
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

  describe('register', () => {
    it.each`
      firstName  | lastName     | email               | username          | locationId | password      | repeatPassword | expectedErrorMessage
      ${'John'}  | ${'Doe'}     | ${''}               | ${'johndoe'}      | ${'1'}     | ${'password'} | ${'password'}  | ${'Validation failed'}
      ${'Jane'}  | ${'Doe'}     | ${'test@test.com'}  | ${'janedoe'}      | ${'2'}     | ${'password'} | ${'password'}  | ${'Email already exists'}
      ${'Alice'} | ${'Johnson'} | ${'alice@test.com'} | ${'alicejohnson'} | ${'4'}     | ${'password'} | ${'password'}  | ${null}
    `(
      'should return expected error message for $email and $username',
      async ({
        firstName,
        lastName,
        email,
        username,
        locationId,
        password,
        repeatPassword,
        expectedErrorMessage,
      }) => {
        const createUserDto: CreateUserDto = {
          firstName,
          lastName,
          email,
          username,
          locationId,
          password,
        };

        try {
          const result = await authController.register(createUserDto);
          expect(result).toEqual({ id: 'mockId', ...createUserDto });
          expect(expectedErrorMessage).toBeNull();
        } catch (error) {
          expect(error.response.message).toEqual(expectedErrorMessage);
        }
      },
    );

    it('should register a new user with valid data', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'Valid',
        lastName: 'User',
        email: 'valid@user.com',
        username: 'validuser',
        locationId: '5',
        password: 'validpassword',
      };
      const result = await authController.register(createUserDto);

      expect(result).toEqual({ id: 'mockId', ...createUserDto });
    });

    it('should handle registration errors', async () => {
      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(new Error('Registration failed'));
      const createUserDto: CreateUserDto = {
        firstName: 'Error',
        lastName: 'User',
        email: 'error@user.com',
        username: 'erroruser',
        locationId: '6',
        password: 'errorpassword',
      };
      await expect(authController.register(createUserDto)).rejects.toThrow(
        'Registration failed',
      );
    });
  });
});
