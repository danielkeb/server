import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyCustomDecorators } from 'src/lib/applyCustomDecorators';

export const ApiGetSummaryEndpoint = () => {
  return applyCustomDecorators([
    ApiOperation({
      summary: "Get summary of the system's data",
    }),
    ApiResponse({
      status: 200,
      description:
        'Return summary data including total users, active users, total projects, and total organizations and more',
    }),
    ApiResponse({
      status: 500,
      description:
        'Internal Server Error - Failed to get summary data. Please try again later.',
    }),
  ]);
};
