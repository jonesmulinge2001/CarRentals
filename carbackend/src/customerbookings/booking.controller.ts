/* eslint-disable prettier/prettier */
 
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { Request } from 'express';
import { CreateBookingDto } from 'src/dto/create-booking.dto';
import { RequirePermissions } from 'src/auth/decorator/permission.decorator';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/auth/auth/guards/permission.guard';
import { Permission } from 'src/permissions/permission.enum';

@Controller('customer/bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.BOOK_VEHICLE)
  async createBooking(@Body() dto: CreateBookingDto, @Req() req: Request) {
    const userId = (req.user as { id: string }).id;
    const booking = await this.bookingService.create(dto, userId);
    return {
      success: true,
      message: 'Booking created successfully',
      data: booking,
    };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.BOOK_VEHICLE)
  async getMyBookings(@Req() req: Request) {
    const userId = (req.user as { id: string }).id;
    const bookings = await this.bookingService.getMyBookings(userId);
    return {
      success: true,
      message: 'Your bookings fetched successfully',
      data: bookings,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.BOOK_VEHICLE)
  async getBooking(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as { id: string }).id;
    const booking = await this.bookingService.getBookingById(id, userId);
    return {
      success: true,
      message: 'Booking retrieved',
      data: booking,
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.BOOK_VEHICLE)
  async updateBooking(
    @Param('id') id: string,
    @Body() dto: Partial<CreateBookingDto>,
    @Req() req: Request,
  ) {
    const userId = (req.user as { id: string }).id;
    const updated = await this.bookingService.update(id, userId, dto);
    return {
      success: true,
      message: 'Booking updated successfully',
      data: updated,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.BOOK_VEHICLE)
  async cancelBooking(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as { id: string }).id;
    await this.bookingService.cancel(id, userId);
    return {
      success: true,
      message: 'Booking canceled successfully',
    };
  }
}
