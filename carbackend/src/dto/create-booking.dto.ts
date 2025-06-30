/* eslint-disable prettier/prettier */
// src/dto/create-booking.dto.ts
import { IsString, IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { BookingStatus } from 'generated/prisma';

export class CreateBookingDto {
  @IsString()
  vehicleId: string;

  @IsDateString()
  startdate: string;

  @IsDateString()
  enddate: string;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsNumber()
  totalPrice: number;
}
