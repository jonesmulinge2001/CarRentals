/* eslint-disable prettier/prettier */
 
/* eslint-disable prettier/prettier */
 
 
// src/user-profile/user-profile.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateUserProfileDto } from 'src/dto/create-user-profile.dto';
import { PrismaClient, UserProfile } from 'generated/prisma';
import {
  CarRentalCloudinaryService,
  CarRentalUploadType,
} from 'src/shared/cloudinary/cloudinary.service';

@Injectable()
export class UserProfileService {
  private prisma = new PrismaClient();

  constructor(private cloudinary: CarRentalCloudinaryService) {}

  async createOrUpdateProfile(
    userId: string,
    dto: CreateUserProfileDto,
    image?: Express.Multer.File,
  ): Promise<UserProfile> {
    let imageUrl: string | undefined;

    if (image) {
      const uploadResult = await this.cloudinary.uploadImage(
        image,
        CarRentalUploadType.USER_PROFILE,
      );
      imageUrl = uploadResult.secure_url;
    }

    const data = {
      bio: dto.bio,
      address: dto.address,
      imageUrl,
      userId,
    };

    return this.prisma.userProfile.upsert({
      where: { userId },
      update: data,
      create: data,
    });
  }

  async getProfileByUserId(userId: string): Promise<UserProfile> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async editProfile(
    userId: string,
    dto: CreateUserProfileDto,
    image?: Express.Multer.File,
  ): Promise<UserProfile> {
    const existing = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!existing) throw new NotFoundException('Profile not found');

    let imageUrl = existing.imageUrl;

    if (image) {
      const uploaded = await this.cloudinary.uploadImage(
        image,
        CarRentalUploadType.USER_PROFILE,
      );
      imageUrl = uploaded.secure_url;
    }

    return this.prisma.userProfile.update({
      where: { userId },
      data: {
        bio: dto.bio,
        address: dto.address,
        imageUrl,
      },
    });
  }
}
