import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { applyCustomDecorators } from 'src/lib/applyCustomDecorators';

export const ApiGetMeEndpoint = () => {
  return applyCustomDecorators([
    ApiOperation({ summary: 'Fetch current user (own) profile' }),
    ApiResponse({
      status: 200,
      description: 'Return the current user profile.',
    }),
    ApiResponse({ status: 404, description: 'User profile cannot be found' }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: 500,
      description:
        'Internal Server Error - Failed to get user profile. Please try again later.',
    }),
  ]);
};

export const ApiGetUserByUsernameEndpoint = () => {
  return applyCustomDecorators([
    ApiOperation({ summary: 'Get user by username' }),
    ApiParam({
      name: 'username',
      description: 'Username of the user to retrieve',
    }),
    ApiResponse({ status: 200, description: 'User found and retrieved' }),
    ApiNotFoundResponse({ description: 'User not found' }),
    ApiResponse({ status: 500, description: 'Failed to find user' }),
  ]);
};

export const ApiUpdateProfileEndpoint = () => {
  return applyCustomDecorators([
    ApiOperation({ summary: 'Update current user (own) profile' }),
    ApiResponse({ status: 200, description: 'Profile update successfully' }),
    ApiResponse({
      status: 400,
      description: 'User provided invalid username and/or email',
    }),
    ApiResponse({
      status: 500,
      description: 'The server is experiencing an error. ',
    }),
  ]);
};

export const ApiRemoveSkillEndpoint = () => {
  return applyCustomDecorators([
    ApiOperation({ summary: 'Remove skill from current user (own) profile' }),
    ApiResponse({ status: 200, description: 'Skill removed successfully' }),
    ApiResponse({
      status: 404,
      description: 'User not found or skill not found',
    }),
    ApiResponse({
      status: 500,
      description: 'The server is experiencing an error. ',
    }),
  ]);
};

export const ApiDeleteAccountEndpoint = () => {
  return applyCustomDecorators([
    ApiOperation({ summary: 'Delete current user (own) account' }),
    ApiResponse({ status: 200, description: 'Profile deleted successfully' }),
    ApiResponse({ status: 404, description: 'User not found' }),
    ApiResponse({
      status: 500,
      description: 'The server is experiencing an error. ',
    }),
  ]);
};

export const ApiUpdateEducationEndpoint = () => {
  return applyCustomDecorators([
    ApiOperation({ summary: 'Update user education information' }),
    ApiResponse({ status: 200, description: 'Education updated successfully' }),
    ApiResponse({ status: 404, description: 'User or education not found' }),
    ApiResponse({ status: 500, description: 'Failed to update education' }),
  ]);
};

export const ApiDeleteEducationEndpoint = () => {
  return applyCustomDecorators([
    ApiOperation({ summary: 'Delete user education information' }),
    ApiResponse({ status: 200, description: 'Education deleted successfully' }),
    ApiResponse({ status: 404, description: 'User or education not found' }),
    ApiResponse({ status: 500, description: 'Failed to delete education' }),
  ]);
};
