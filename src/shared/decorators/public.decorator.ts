import { SetMetadata } from '@nestjs/common';

export const DECORATOR_PUBLIC = Symbol('isPublic');
export const Public = () => SetMetadata(DECORATOR_PUBLIC, true);
