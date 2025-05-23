import {
  PipeTransform,
  Injectable,
  BadRequestException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ParseFilePipeBuilder } from '@nestjs/common';

@Injectable()
export class FilesValidationPipe implements PipeTransform {
  constructor(
    private readonly options: { isRequired?: boolean } = { isRequired: true },
    // maxSize is in MB, for example we pass 1, it means 1MB
    private readonly maxSize: number = 1 * 1024 * 1024, // Mặc định 1MB
    private readonly fileTypes: string[] = ['jpeg'],
    private readonly maxFiles: number = 0,
  ) {}

  transform(files: Express.Multer.File[]) {
    if (this.options.isRequired && (!files || files.length === 0)) {
      throw new BadRequestException('At least one file is required');
    }

    if (this.maxFiles != 0 && files.length > this.maxFiles) {
      throw new BadRequestException(
        `Too many files. Maximum allowed is ${this.maxFiles}`,
      );
    }

    const maxFileSize = this.maxSize * 1024 * 1024; // convert to MB

    // We have to check manually because here we return the map. if we return ParseFilePipeBuilder in map, it will crash server when we pass an invalid file
    return files.map((file) => {
      try {
        // Check file type
        const fileExtension = file.originalname.split('.').pop().toLowerCase();
        if (!this.fileTypes.includes(fileExtension)) {
          throw new BadRequestException(
            `Invalid file type. Allowed types: ${this.fileTypes.join(', ')}`,
          );
        }

        // Check file size
        if (file.size > maxFileSize) {
          throw new BadRequestException(
            `File too large. Maximum size allowed is ${this.maxSize}MB`,
          );
        }

        return file;
      } catch (error) {
        // Handle errors individually without crashing the server
        if (error instanceof HttpException) {
          throw error;
        }
        throw new BadRequestException(
          `File validation error: ${error.message}`,
        );
      }
    });
  }
}
