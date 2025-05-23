import {
  PipeTransform,
  Injectable,
  HttpStatus,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ParseFilePipeBuilder } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(
    // maxSize is in MB, for example we pass 1, it means 1MB
    private readonly maxSize: number = 1 * 1024 * 1024, // Giá trị mặc định: 1mb
    private readonly fileTypes: string[] = ['jpeg'], // Giá trị mặc định: chỉ cho phép JPEG
    private readonly fileIsRequired: boolean = false,
  ) {}

  transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    const maxFileSize = this.maxSize * 1024 * 1024; // convert to MB
    return new ParseFilePipeBuilder()
      .addFileTypeValidator({ fileType: new RegExp(this.fileTypes.join('|')) })
      .addMaxSizeValidator({ maxSize: maxFileSize })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        fileIsRequired: this.fileIsRequired,
      })
      .transform(file);
  }
}
