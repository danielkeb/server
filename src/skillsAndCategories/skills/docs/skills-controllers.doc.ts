import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyCustomDecorators } from 'src/lib/applyCustomDecorators';
import { CreateSkillDto } from '../dto/create-skill.dto';

export const ApiCreateSkillEndpoint = () => {
  return applyCustomDecorators([
    ApiOperation({ summary: 'Create a new skill' }),
    ApiBody({ type: CreateSkillDto }),
    ApiResponse({
      status: 201,
      description: 'Skill created successfully',
    }),
    ApiResponse({ status: 400, description: 'Bad Request' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Category not found' }),
    ApiResponse({
      status: 409,
      description: 'A skill with the same name already exists',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal Server Error',
    }),
  ]);
};

export const ApiFindAllSkillsEndpoint = () => {
  return applyCustomDecorators([
    ApiOperation({ summary: 'Find all skills' }),
    ApiResponse({
      status: 200,
      description: 'Return all skills with project and user counts',
    }),
    ApiResponse({ status: 500, description: 'Internal Server Error' }),
  ]);
};

export const ApiSearchSkillsEndpoint = () => {
  return applyCustomDecorators([
    ApiOperation({ summary: 'Search skills by name' }),
    ApiResponse({
      status: 200,
      description:
        'Return all skills that match the query with project and user counts',
    }),
    ApiResponse({ status: 500, description: 'Internal Server Error' }),
  ]);
};

export const ApiFindOneSkillEndpoint = () => {
  return applyCustomDecorators([
    ApiOperation({ summary: 'Find a skill by ID' }),
    ApiResponse({
      status: 200,
      description: 'Return the skill with project and user counts',
    }),
    ApiResponse({ status: 404, description: 'Skill not found' }),
    ApiResponse({ status: 500, description: 'Internal Server Error' }),
  ]);
};

export const ApiUpdateSkillEndpoint = () => {
  return applyCustomDecorators([
    ApiOperation({ summary: 'Update a skill by ID' }),
    ApiResponse({ status: 200, description: 'Skill updated successfully' }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Skill or category not found' }),
    ApiResponse({
      status: 409,
      description: 'Conflict - Skill with the same name already exists',
    }),
    ApiResponse({ status: 500, description: 'Internal Server Error' }),
  ]);
};

export const ApiDeleteSkillEndpoint = () => {
  return applyCustomDecorators([
    ApiOperation({ summary: 'Delete a skill by ID' }),
    ApiResponse({ status: 200, description: 'Skill deleted successfully' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Skill not found' }),
    ApiResponse({ status: 500, description: 'Internal Server Error' }),
  ]);
};
