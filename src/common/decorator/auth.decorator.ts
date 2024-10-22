import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiAuth() {
  return applyDecorators(
    ApiOperation({ summary: 'Authentication endpoints' }),
    ApiResponse({
      status: 200,
      description: 'Operation successful',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request',
    }),
  );
}
