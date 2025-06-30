/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PermissionController } from './permissions.controller';
import { PermissionService } from 'src/auth/auth/guards/permission.guard';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionsModule {}
