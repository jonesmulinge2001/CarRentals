/* eslint-disable prettier/prettier */
// src/admin/admin.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class AdminService {
  private prisma = new PrismaClient();

  async getDashboardStats() {
    const [
      totalUsers,
      totalVehicles,
      bookedVehicles,
      availableVehicles,
      revenueResult,
    ] = await Promise.all([
      this.prisma.user.count({ where: { isDeleted: false } }),
      this.prisma.vehicle.count({ where: { isDeleted: false } }),
      this.prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      this.prisma.vehicle.count({
        where: { isDeleted: false, available: true },
      }),
      this.prisma.payment.aggregate({ _sum: { amount: true } }),
    ]);

    return {
      totalUsers,
      totalVehicles,
      bookedVehicles,
      availableVehicles,
      revenue: revenueResult._sum.amount ?? 0,
    };
  }
}
