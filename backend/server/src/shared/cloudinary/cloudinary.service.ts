// cloudinary.service.ts

import { CLOUDINARY_ROOT_FOLDER } from '@common/constants/cloudinary.constant';
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    folderName: string,
    fileName: string = '',
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const finalName = fileName || `img_${Date.now()}`;
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `${CLOUDINARY_ROOT_FOLDER}/${this.convertToFolderName(folderName)}`,
          public_id: finalName,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadManyFiles(
    files: Express.Multer.File[],
    folderName: string,
    fileNames: any[] = [],
  ): Promise<CloudinaryResponse[]> {
    return Promise.all(
      files.map((file, index) =>
        this.uploadFile(
          file,
          folderName,
          fileNames[index]?.toString() || index.toString(),
        ),
      ),
    );
  }

  async createNewFolder(folderName: string): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      cloudinary.api
        .create_folder(`${CLOUDINARY_ROOT_FOLDER}/${folderName}`)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  }

  convertToFolderName(folderName: string): string {
    return folderName.toLowerCase().replace(/\s+/g, '-'); // Replace spaces with hyphens
  }
}
