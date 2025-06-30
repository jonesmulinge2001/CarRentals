/* eslint-disable prettier/prettier */
 
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Vehicle } from 'generated/prisma';
import { CreateVehicleDto } from 'src/dto/create-vehicle.dto';
import { UpdateVehicleDto } from 'src/dto/update-vehicle.dto';
import { CarRentalCloudinaryService, CarRentalUploadType } from 'src/shared/cloudinary/cloudinary.service';

@Injectable()
export class VehicleService {
  private prisma = new PrismaClient();

  constructor(private cloudinaryService: CarRentalCloudinaryService) {}

  // ✅ Create vehicle with image
  async createVehicle(dto: CreateVehicleDto, file: Express.Multer.File): Promise<Vehicle> {
    const uploadResult = await this.cloudinaryService.uploadImage(file, CarRentalUploadType.VEHICLE_IMAGE);

    return this.prisma.vehicle.create({
      data: {
        ...dto,
        available: dto.available,
        pricePerHour: Number(dto.pricePerHour),
        imageUrl: uploadResult.secure_url,
      },
    });
  }

  // ✅ Get all vehicles
  async getAllVehicles() {
    return await this.prisma.vehicle.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ✅ Get one vehicle
  async getVehicleById(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle || vehicle.isDeleted) {
      throw new NotFoundException('Vehicle not found');
    }
    return vehicle;
  }

  // ✅ Update vehicle
  async updateVehicle(id: string, dto: UpdateVehicleDto) {
    return await this.prisma.vehicle.update({
      where: { id },
      data: {
        ...dto,
        pricePerHour: Number(dto.pricePerHour),
    }
    });
  }

  // ✅ Soft delete
  async deleteVehicle(id: string) {
    await this.getVehicleById(id); // validation
    return await this.prisma.vehicle.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }
}
