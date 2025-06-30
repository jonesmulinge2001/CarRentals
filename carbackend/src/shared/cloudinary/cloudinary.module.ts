/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CarRentalCloudinaryService } from './cloudinary.service';

@Module({
  imports: [ConfigModule],
  providers: [CarRentalCloudinaryService],
  exports: [CarRentalCloudinaryService],
})
export class CloudinaryModule {}
