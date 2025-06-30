/* eslint-disable prettier/prettier */
// src/admin/vehicle.module.ts
import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
  imports: [CloudinaryModule, PermissionsModule],
  providers: [VehicleService],
  controllers: [VehicleController],
})
export class VehicleModule {}
