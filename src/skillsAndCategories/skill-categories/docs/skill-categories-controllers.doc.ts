import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyCustomDecorators } from 'src/lib/applyCustomDecorators';

export const ApiCreateSkillCategoryEndpoint = () => {
  return applyCustomDecorators([
    ApiOperation({ summary: 'Create a new skill category' }),
    ApiResponse({
      status: 200,
      description: 'Skill category created successfully',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict - A category with the same name already exists',
    }),
    ApiResponse({
      status: 500,
      description:
        'Internal Server Error - Failed to create skill category. Please try again later.',
    }),
  ]);
};

export const ApiFindAllSkillCategoriesEndpoint = () => {
  return applyCustomDecorators([
    ApiOperation({ summary: 'Fetch all skill categories' }),
    ApiResponse({
      status: 200,
      description: 'Return all skill categories.',
    }),
    ApiResponse({
      status: 500,
      description:
        'Internal Server Error - Failed to find all skill categories. Please try again later.',
    }),
  ]);
};

export const ApiFindSkillCategoryByIdEndpoint = () => {
  return applyCustomDecorators([
    ApiOperation({ summary: 'Fetch a skill category by ID' }),
    ApiResponse({
      status: 200,
      description: 'Return the skill category with the specified ID.',
    }),
    ApiResponse({ status: 404, description: 'Skill category not found' }),
    ApiResponse({
      status: 500,
      description:
        'Internal Server Error - Failed to find skill category. Please try again later.',
    }),
  ]);
};

export const ApiFindSkillCategoryByNameEndpoint = () => {
  return applyCustomDecorators([
    ApiOperation({ summary: 'Fetch a skill category by name' }),
    ApiResponse({
      status: 200,
      description: 'Return the skill category with the specified name.',
    }),
    ApiResponse({ status: 404, description: 'Skill category not found' }),
    ApiResponse({
      status: 500,
      description:
        'Internal Server Error - Failed to find skill category. Please try again later.',
    }),
  ]);
};

export const ApiUpdateSkillCategoryEndpoint = () => {
  return applyCustomDecorators([
    ApiOperation({ summary: 'Update a skill category by ID' }),
    ApiResponse({
      status: 200,
      description: 'Return the updated skill category.',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Skill category not found' }),
    ApiResponse({
      status: 409,
      description: 'Conflict - A category with the same name already exists',
    }),
    ApiResponse({
      status: 500,
      description:
        'Internal Server Error - Failed to update skill category. Please try again later.',
    }),
  ]);
};

export const ApiRemoveSkillCategoryEndpoint = () => {
  return applyCustomDecorators([
    ApiOperation({ summary: 'Delete a skill category by ID' }),
    ApiResponse({
      status: 200,
      description: 'Category deleted successfully.',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Skill category not found' }),
    ApiResponse({
      status: 500,
      description:
        'Internal Server Error - Failed to delete skill category. Please try again later.',
    }),
  ]);
};
