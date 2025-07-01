/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import { Transform } from 'class-transformer';
import { IsString, IsBoolean, IsNumber, IsEnum } from 'class-validator';
import { Category } from 'generated/prisma';

export class CreateVehicleDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  pricePerHour: number;

  @IsEnum(Category)
  category: Category;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  available: boolean;

  @IsString()
  location: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  fuelCapacity: number;  

  @IsString()
  transmission: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  seatingCapacity: number;
}
