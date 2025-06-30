/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaClient, Booking } from 'generated/prisma'; // Adjust path if needed
import { CreateBookingDto } from 'src/dto/create-booking.dto';

@Injectable()
export class BookingService {
  private prisma = new PrismaClient();

  // ✅ Create a booking
  async create(dto: CreateBookingDto, userId: string): Promise<Booking> {
    return await this.prisma.booking.create({
      data: {
        userId,
        vehicleId: dto.vehicleId,
        startdate: new Date(dto.startdate),
        enddate: new Date(dto.enddate),
        totalPrice: dto.totalPrice,
        status: dto.status ?? 'PENDING', // Default if not provided
      },
    });
  }
  

  // ✅ Get all bookings by current user
  async getMyBookings(userId: string): Promise<Booking[]> {
    return await this.prisma.booking.findMany({
      where: { userId },
      include: {vehicle: true},
      orderBy: { createdAt: 'desc' },
    });
  }

  // ✅ Get one booking by ID, only if it belongs to current user
  async getBookingById(id: string, userId: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (booking.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return booking;
  }

  // ✅ Update booking (partial DTO)
  async update(id: string, userId: string, dto: Partial<CreateBookingDto>): Promise<Booking> {
    const booking = await this.getBookingById(id, userId); 
    return await this.prisma.booking.update({
      where: { id },
      data: dto,
    });
  }

  // ✅ Cancel (delete) booking
  async cancel(id: string, userId: string): Promise<void> {
    const booking = await this.getBookingById(id, userId);
    await this.prisma.booking.delete({ where: { id } });
  }
}
