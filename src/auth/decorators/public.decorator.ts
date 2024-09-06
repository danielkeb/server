import { SetMetadata } from '@nestjs/common';

// Custom decorator to opt out of JWT authentication on public API endpoints
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
