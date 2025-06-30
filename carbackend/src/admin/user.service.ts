/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { UpdateUserRoleDto } from 'src/dto/update-user-role.dto';
import { SafeUser } from 'src/interfaces/user.interface';

@Injectable()
export class UserService {
  prisma = new PrismaClient();

  // get all users (EXCLUDE password & tokens)
  async getAllUsers(): Promise<SafeUser[]> {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
        deletedAt: true,
      },
    });
  }

  // get a user by id (EXCLUDE password & tokens)
  async getUserById(id: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
        deletedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // update user role
  async updateUserRole(id: string, dto: UpdateUserRoleDto): Promise<SafeUser> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { role: dto.role },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
        deletedAt: true,
      },
    });

    return user;
  }

  // delete a user
  async deleteUser(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
