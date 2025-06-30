/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    UseGuards,
  } from '@nestjs/common';
  import { BookingService } from './booking.service';
  import { UpdateBookingDto } from 'src/dto/update-booking.dto';
  import { AuthGuard } from '@nestjs/passport';
  import { RequirePermissions } from 'src/auth/decorator/permission.decorator';
  import { Permission } from 'src/permissions/permission.enum';
  import { PermissionGuard } from 'src/auth/auth/guards/permission.guard';
  
  @Controller('admin/bookings')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  export class BookingController {
    constructor(
        private readonly bookingService: BookingService) {}
  
    @Get()
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @RequirePermissions(Permission.MANAGE_BOOKINGS)
    async findAll() {
      return {
        success: true,
        message: 'Bookings retrieved successfully',
        data: await this.bookingService.findAll(),
      };
    }
  
    @Get(':id')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @RequirePermissions(Permission.MANAGE_BOOKINGS)
    async findOne(@Param('id') id: string) {
      return {
        success: true,
        message: 'Booking retrieved successfully',
        data: await this.bookingService.findOne(id),
      };
    }
  
    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @RequirePermissions(Permission.MANAGE_BOOKINGS)
    async update(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
      return {
        success: true,
        message: 'Booking updated successfully',
        data: await this.bookingService.update(id, dto),
      };
    }
  
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @RequirePermissions(Permission.MANAGE_BOOKINGS)
    async remove(@Param('id') id: string) {
      await this.bookingService.delete(id);
      return {
        success: true,
        message: 'Booking deleted successfully',
      };
    }
  }
  