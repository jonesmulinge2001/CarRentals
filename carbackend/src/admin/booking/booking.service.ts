/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaClient, BookingStatus } from 'generated/prisma';
import { UpdateBookingDto } from 'src/dto/update-booking.dto';
import { MailerService } from 'src/shared/mailer/mailer.service';

@Injectable()
export class BookingService {
    constructor(private mailerService: MailerService) {}

  private prisma = new PrismaClient();

  // Admin only
  async findAll() {
    return this.prisma.booking.findMany({
      where: { isDeleted: false },
      include: { user: true, vehicle: true, payment: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { user: true, vehicle: true, payment: true },
    });
    if (!booking || booking.isDeleted)
      throw new NotFoundException('Booking not found');
    return booking;
  }

  async update(id: string, dto: UpdateBookingDto) {
    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: dto,
      include: {
        user: true,
        vehicle: true,
      },
    });
  
    if (dto.status === BookingStatus.CONFIRMED) {
      await this.prisma.vehicle.update({
        where: { id: updatedBooking.vehicleId },
        data: { available: false },
      });
  
      // ✅ Send confirmation email
      const user = updatedBooking.user;
      const vehicle = updatedBooking.vehicle;
      await this.mailerService.sendEmail({
        to: user.email,
        subject: 'Your Booking Has Been Approved',
        template: 'email/booking-approved',
        context: {
          username: user.name,
          vehicleName: vehicle.name,
          startdate: new Date(updatedBooking.startdate).toLocaleString(),
          enddate: new Date(updatedBooking.enddate).toLocaleString(),
          rentalName: 'Car Rentals',
          supportEmail: 'support@carrentals.com',
        },
      });
    }
  
    if (
      dto.status === BookingStatus.CANCELLED ||
      dto.status === BookingStatus.REJECTED
    ) {
      await this.prisma.vehicle.update({
        where: { id: updatedBooking.vehicleId },
        data: { available: true },
      });
    }
  
    return updatedBooking;
  }
  
  async delete(id: string) {
    const booking = await this.findOne(id);
  
    // Soft delete the booking
    const updated = await this.prisma.booking.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  
    // ✅ Mark the vehicle as available again
    await this.prisma.vehicle.update({
      where: { id: booking.vehicleId },
      data: { available: true },
    });
  
    return updated;
  }
  
  

  async getBookingById(id: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking || booking.isDeleted)
      throw new NotFoundException('Booking not found');
    if (booking.userId !== userId)
      throw new ForbiddenException('Access denied');
    return booking;
  }
}
