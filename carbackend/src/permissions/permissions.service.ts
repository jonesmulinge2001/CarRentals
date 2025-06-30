/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Permission } from '../permissions/permission.enum';
import { Role } from 'generated/prisma/client';

@Injectable()
export class PermissionService {
  private readonly rolePermissions: Record<Role, Permission[]> = {
    ADMIN: [
      Permission.MANAGE_VEHICLES,
      Permission.MANAGE_USERS,
      Permission.MANAGE_BOOKINGS,
      Permission.VIEW_USERS,
      Permission.VIEW_BOOKINGS,
      Permission.UPDATE_BOOKING_STATUS,
    ],
    CUSTOMER: [
      Permission.VIEW_VEHICLES,
      Permission.BOOK_VEHICLE,
      Permission.VIEW_BOOKINGS,
      Permission.CANCEL_BOOKING,
    ],
    AGENT: [
      Permission.VIEW_BOOKINGS,
      Permission.UPDATE_BOOKING_STATUS,
      Permission.VIEW_VEHICLES,
      Permission.APPROVE_BOOKINGS,
    ],
  };

  getRolePermissions(role: Role): Permission[] {
    return this.rolePermissions[role] || [];
  }

  hasPermission(role: Role, permission: Permission): boolean {
    return this.getRolePermissions(role).includes(permission);
  }
}