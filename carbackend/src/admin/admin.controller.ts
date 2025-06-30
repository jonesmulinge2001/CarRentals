/* eslint-disable prettier/prettier */
// src/admin/admin.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboardStats() {
    return await this.adminService.getDashboardStats();
  }
}
