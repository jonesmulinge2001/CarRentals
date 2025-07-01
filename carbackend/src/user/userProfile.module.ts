/* eslint-disable prettier/prettier */
// src/user-profile/user-profile.module.ts
import { Module } from '@nestjs/common';
import { CarRentalCloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { UserProfileController } from './userProfile.controller';
import { UserProfileService } from './userProfile.service';

@Module({
  controllers: [UserProfileController],
  providers: [UserProfileService, CarRentalCloudinaryService],
})
export class UserProfileModule {}
