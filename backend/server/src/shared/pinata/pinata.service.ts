import { Inject, Injectable } from '@nestjs/common';
import { PinataSDK } from 'pinata-web3';
import { Blob } from 'buffer';
import { PinataResponse } from './pinata-response';
@Injectable()
export class PinataService {
  constructor(@Inject('PINATA_SDK') private readonly pinata: PinataSDK) {}

  async uploadFile(
    file: Buffer | Express.Multer.File,
    fileName: string,
    groupName: string = '',
  ): Promise<PinataResponse> {
    const fileBuffer = file instanceof Buffer ? file : file.buffer;
    const objFile = Object.assign(
      new Blob([fileBuffer], { type: 'text/plain' }),
      {
        name: fileName,
        lastModified: Date.now(),
      },
    );

    let group: PinataResponse = null;
    if (groupName != '') {
      const groups = await this.getGroupByName(groupName);
      if (groups.length === 0) {
        group = await this.createNewGroup(groupName);
      } else {
        group = groups[0];
      }
    }

    //  Upload file lên Pinata
    const upload = await this.pinata.upload.file(objFile, {
      groupId: group == null ? '' : group['id'],
    });

    return upload;
  }

  async uploadManyFiles(
    files: (Express.Multer.File | Buffer)[],
    groupName: string = '',
    fileNames: any[] = [],
  ): Promise<PinataResponse[]> {
    return Promise.all(
      files.map((file, index) =>
        this.uploadFile(
          file,
          fileNames[index]?.toString() || index.toString(),
          groupName,
        ),
      ),
    );
  }

  async folderUpload(
    files: (Express.Multer.File | Buffer)[],
    groupName: string = '',
    fileNames: any[] = [],
    folderName: string = 'folder_from_sdk',
  ) {
    let group: PinataResponse = null;
    if (groupName != '') {
      const groups = await this.getGroupByName(groupName);
      if (groups.length === 0) {
        group = await this.createNewGroup(groupName);
      } else {
        group = groups[0];
      }
    }

    // Convert files to the format expected by pinata.upload.fileArray
    const fileObjects = files.map((file, index) => {
      const fileBuffer = file instanceof Buffer ? file : file.buffer;
      return Object.assign(new Blob([fileBuffer], { type: 'text/plain' }), {
        name: fileNames[index]?.toString() || `file-${index}`,
        lastModified: Date.now(),
      });
    });

    const upload = await this.pinata.upload.fileArray(fileObjects, {
      groupId: group == null ? '' : group['id'],
      metadata: {
        name: folderName, // Set custom folder name
      },
    });

    return upload;
  }

  async deleteFilesByCid(cid: string[]): Promise<PinataResponse[]> {
    const deleteResponse = await this.pinata.unpin(cid);
    return deleteResponse;
  }

  async createNewGroup(folderName: string): Promise<PinataResponse> {
    const group = await this.pinata.groups.create({ name: folderName });
    return group;
  }

  async getGroupByName(groupName: string): Promise<PinataResponse[]> {
    const group = await this.pinata.groups.list().name(groupName);
    return group;
  }

  async getFileByCid(cid: string): Promise<PinataResponse> {
    const file = await this.pinata.gateways.get(cid);
    return file;
  }
}
