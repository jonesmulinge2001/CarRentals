/* eslint-disable prettier/prettier */
import { IsEnum } from 'class-validator';

export class UpdateUserRoleDto {
  @IsEnum(['ADMIN', 'CUSTOMER', 'AGENT'], {
    message: 'Role must be ADMIN, CUSTOMER, or AGENT',
  })
  role: 'ADMIN' | 'CUSTOMER' | 'AGENT';
}
