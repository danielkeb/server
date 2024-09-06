import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ description: 'First name of the user' })
  firstName: string;

  @IsString()
  @ApiProperty({ description: 'Last name of the user' })
  lastName: string;

  @IsString()
  @ApiProperty({ description: 'Username of the user' })
  username: string;

  @IsEmail()
  @ApiProperty({
    description: 'Email address of the user',
  })
  email: string;

  @IsString()
  @Length(8, 20, {
    message: 'Password must be between 8 and 20 characters long.',
  })
  @ApiProperty({ description: 'User password', minLength: 8, maxLength: 20 })
  password: string;

  @IsString()
  @ApiProperty({ description: "ID of the user's location" })
  locationId: string;
}
