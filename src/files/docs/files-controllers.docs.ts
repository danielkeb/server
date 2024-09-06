import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { applyCustomDecorators } from 'src/lib/applyCustomDecorators';

export const ApiProfilePicUpdateEndpoint = () => {
  return applyCustomDecorators([
    ApiOperation({ summary: 'Update user profile picture' }),
    ApiResponse({
      status: 201,
      description: 'User profile picture updated successfully',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: 404,
      description: 'User with specified email does not exist',
    }),
    ApiResponse({
      status: 500,
      description:
        'Failed to update user profile image. Please try again later.',
    }),
    ApiParam({ name: 'file', type: 'string', format: 'binary' }),
  ]);
};

export const ApiGetProfilePictureEndpoint = () => {
  return applyCustomDecorators([
    ApiOperation({ summary: 'Get profile picture of a user by email' }),
    ApiResponse({
      status: 200,
      description: 'Profile picture retrieved successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'User or profile picture not found',
    }),
    ApiResponse({
      status: 500,
      description:
        'Internal Server Error - Failed to fetch profile picture. Please try again later.',
    }),
  ]);
};

export const ApiDeleteProfilePictureEndpoint = () => {
  return applyCustomDecorators([
    ApiOperation({ summary: 'Delete own profile picture.' }),
    ApiResponse({
      status: 200,
      description: 'Profile picture deleted successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'User with the specified id not found',
    }),
    ApiResponse({
      status: 500,
      description:
        'Internal Server Error - Failed to delete profile picture. Please try again later.',
    }),
  ]);
};
