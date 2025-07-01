/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/user-profile/user-profile.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserProfileDto } from 'src/dto/create-user-profile.dto';
import { Express } from 'express';
import { UserProfileService } from './userProfile.service';

@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  // Create or update user profile
  @Post(':userId')
  @UseInterceptors(FileInterceptor('image'))
  async createOrUpdateProfile(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() dto: CreateUserProfileDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const profile = await this.userProfileService.createOrUpdateProfile(
      userId,
      dto,
      image,
    );
    return {
      message: 'Profile saved successfully',
      data: profile,
    };
  }

  // Get user profile
  @Get(':userId')
  async getProfile(@Param('userId', new ParseUUIDPipe()) userId: string) {
    const profile = await this.userProfileService.getProfileByUserId(userId);
    return {
      message: 'Profile fetched successfully',
      data: profile,
    };
  }

  @Patch(':userId')
  @UseInterceptors(FileInterceptor('image'))
  async updateProfile(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() dto: CreateUserProfileDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const updatedProfile = await this.userProfileService.editProfile(
      userId,
      dto,
      image,
    );
    return {
      message: 'Profile updated successfully',
      data: updatedProfile,
    };
  }
}
