/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateUserProfileDto {
  @IsString()
  @IsNotEmpty()
  bio: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsUrl()
  @IsOptional()
  profileImageUrl?: string;
}
