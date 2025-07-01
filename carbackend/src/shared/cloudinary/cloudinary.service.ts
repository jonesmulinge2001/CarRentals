/* eslint-disable prettier/prettier */
 
 
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

export interface CloudinaryUploadResult extends UploadApiResponse {
  folder: string;
}

export interface CarRentalUploadConfig {
  uploadType: CarRentalUploadType;
  maxSizeBytes: number;
  allowedFormats: string[];
  folder: string;
  transformations?: any;
}

export enum CarRentalUploadType {
  VEHICLE_IMAGE = 'vehicle_image',
  USER_PROFILE = 'user_profile',
  DOCUMENT = 'document',
  BANNER = 'banner',
}

@Injectable()
export class CarRentalCloudinaryService {
  private readonly logger = new Logger(CarRentalCloudinaryService.name);

  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });

    this.logger.log('Car Rental Cloudinary service initialized');
  }

  private getUploadConfig(uploadType: CarRentalUploadType): CarRentalUploadConfig {
    const configs: Record<CarRentalUploadType, CarRentalUploadConfig> = {
      [CarRentalUploadType.VEHICLE_IMAGE]: {
        uploadType,
        maxSizeBytes: 5 * 1024 * 1024,
        allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        folder: 'car_rental/vehicles/images',
        transformations: {
          width: 1024,
          height: 768,
          crop: 'fill',
          quality: 'auto',
          format: 'auto',
        },
      },
      [CarRentalUploadType.USER_PROFILE]: {
        uploadType,
        maxSizeBytes: 2 * 1024 * 1024,
        allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        folder: 'car_rental/users/profiles',
        transformations: {
          width: 400,
          height: 400,
          crop: 'fill',
          gravity: 'face',
          quality: 'auto',
          format: 'auto',
        },
      },
      [CarRentalUploadType.DOCUMENT]: {
        uploadType,
        maxSizeBytes: 10 * 1024 * 1024,
        allowedFormats: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
        folder: 'car_rental/documents',
      },
      [CarRentalUploadType.BANNER]: {
        uploadType,
        maxSizeBytes: 8 * 1024 * 1024,
        allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        folder: 'car_rental/banners',
        transformations: {
          width: 1600,
          height: 600,
          crop: 'fill',
          quality: 'auto',
          format: 'auto',
        },
      },
    };

    return configs[uploadType];
  }

  async uploadImage(
    file: Express.Multer.File,
    uploadType: CarRentalUploadType,
  ): Promise<CloudinaryUploadResult> {
    const config = this.getUploadConfig(uploadType);

    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > config.maxSizeBytes) {
      throw new BadRequestException('File exceeds maximum allowed size');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: config.folder,
          transformation: config.transformations,
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) {
            return reject(
              new BadRequestException('Cloudinary upload failed: ' + (error?.message || 'Unknown error')),
            );
          }

          const uploadResult: CloudinaryUploadResult = {
            ...result,
            folder: config.folder,
          };

          resolve(uploadResult);
        },
      );

      uploadStream.end(file.buffer);
    });
  }
}
