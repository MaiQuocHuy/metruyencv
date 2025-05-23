import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseToNumberArrayPipe<T> implements PipeTransform<T[], number[]> {
  transform(value: T[], metadata: ArgumentMetadata): number[] {
    if (!value || !Array.isArray(value)) {
      throw new BadRequestException();
    }
    const transformedArray = value.map((item) => {
      const number = Number(item);
      if (isNaN(number)) {
        throw new BadRequestException();
      }
      return number;
    });

    return transformedArray;
  }
}
