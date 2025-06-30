/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { VehicleService } from './vehicle.service';
  import { CreateVehicleDto } from 'src/dto/create-vehicle.dto';
  import { UpdateVehicleDto } from 'src/dto/update-vehicle.dto';
  import { Express } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { PermissionGuard } from 'src/auth/auth/guards/permission.guard';
import { RequirePermissions } from 'src/auth/decorator/permission.decorator';
import { Permission } from 'src/permissions/permission.enum';
  
  @Controller('admin/vehicle')
  export class VehicleController {
    constructor(private readonly vehicleService: VehicleService) {}
  
    // ✅ Create vehicle with image
    @Post()
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @RequirePermissions(Permission.MANAGE_VEHICLES)
    @UseInterceptors(FileInterceptor('image'))
    async create(
      @UploadedFile() file: Express.Multer.File,
      @Body() dto: CreateVehicleDto,
    ) {
      const vehicle = await this.vehicleService.createVehicle(dto, file);
      return {
        success: true,
        message: 'Vehicle created successfully',
        data: vehicle,
      };
    }
  
    @Get()
    async findAll() {
      return {
        success: true,
        message: 'Vehicles retrieved successfully',
        data: await this.vehicleService.getAllVehicles(),
      };
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return {
        success: true,
        message: 'Vehicle retrieved successfully',
        data: await this.vehicleService.getVehicleById(id),
      };
    }
  
    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @RequirePermissions(Permission.MANAGE_VEHICLES)
    async update(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
      return {
        success: true,
        message: 'Vehicle updated successfully',
        data: await this.vehicleService.updateVehicle(id, dto),
      };
    }
  
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), PermissionGuard)
    @RequirePermissions(Permission.MANAGE_VEHICLES)
    async delete(@Param('id') id: string) {
      await this.vehicleService.deleteVehicle(id);
      return {
        success: true,
        message: 'Vehicle deleted successfully',
      };
    }
  }
  