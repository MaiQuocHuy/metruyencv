import { applyDecorators, Type } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const ApiPaginateQuery = () => {
  return applyDecorators(
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
  );
};
