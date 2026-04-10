import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

export interface UploadedImage {
  url: string;
  isMain?: boolean;
  order?: number;
}

@Injectable()
export class CloudinaryService {
  private cloudinaryClient = cloudinary;

  /**
   * Sube un archivo a Cloudinary
   */
  async uploadSingle(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    const base64 = file.buffer.toString('base64');
    const dataUri = `data:${file.mimetype};base64,${base64}`;
    const result = await this.cloudinaryClient.uploader.upload(dataUri, {
      folder,
    });
    return result.secure_url;
  }

  /**
   * Sube múltiples archivos a Cloudinary
   */
  async uploadMultiple(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<UploadedImage[]> {
    return Promise.all(
      files.map(async (file, index) => {
        const url = await this.uploadSingle(file, folder);
        return {
          url,
          isMain: index === 0,
          order: index,
        };
      }),
    );
  }

  /**
   * Elimina múltiples imágenes de Cloudinary
   * ✅ Basado en tu implementación original
   */
  async deleteImages(images: { url: string }[]): Promise<void> {
    if (images.length === 0) return;

    await Promise.all(
      images.map(async (image) => {
        const publicId = this.extractPublicIdFromUrl(image.url);
        if (!publicId) return;

        try {
          await this.cloudinaryClient.uploader.destroy(publicId);
        } catch (error) {
          console.error(`Failed to delete image ${publicId}:`, error);
        }
      }),
    );
  }

  /**
   * Elimina una sola imagen de Cloudinary
   */
  async deleteImage(imageUrl: string): Promise<void> {
    await this.deleteImages([{ url: imageUrl }]);
  }

  /**
   * Extrae el public_id de una URL de Cloudinary
   * ✅ Basado en tu implementación original
   */
  private extractPublicIdFromUrl(url: string): string | null {
    try {
      const matches = url.match(/\/v\d+\/(.+)\.\w+$/);
      if (matches && matches[1]) {
        return matches[1];
      }
      return null;
    } catch {
      return null;
    }
  }
}
