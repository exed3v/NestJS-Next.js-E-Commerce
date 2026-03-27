import { BadRequestException } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

const imageFileFilter = (req: any, file: any, callback: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return callback(
      new BadRequestException(
        'Only image files are allowed (jpg, jpeg, png, gif, webp)',
      ),
      false,
    );
  }
  callback(null, true);
};

// Para múltiples archivos
export const UploadImagesInterceptor = () =>
  FilesInterceptor('images', 10, {
    storage: memoryStorage(),
    fileFilter: imageFileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB por archivo
    },
  });

// Para un solo archivo
export const UploadImageInterceptor = () =>
  FileInterceptor('image', {
    storage: memoryStorage(),
    fileFilter: imageFileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
