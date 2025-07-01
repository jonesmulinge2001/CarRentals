/* eslint-disable prettier/prettier */

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { CreateReviewDto } from 'src/dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor() {}

  private prisma = new PrismaClient();
  async createReview(userId: string, dto: CreateReviewDto) {
    const { vehicleId, rating, comment } = dto;

    // Optional: Check if the user already reviewed this vehicle
    const alreadyExists = await this.prisma.review.findFirst({
      where: { userId, vehicleId },
    });

    if (alreadyExists) {
      throw new BadRequestException(
        'You have already submitted a review for this vehicle.',
      );
    }

    // Save the new review
    const review = await this.prisma.review.create({
      data: {
        userId,
        vehicleId,
        rating,
        comment,
      },
    });

    return {
      message: 'Review submitted successfully',
      data: review,
    };
  }

  async getReviewsByVehicle(vehicleId: string) {
    return this.prisma.review.findMany({
      where: { vehicleId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAllReviews() {
    return this.prisma.review.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
            vehicle: {
                select: {
                    title: true
                },
            },
        },
        orderBy: {
            createdAt: 'asc'
        }
    })
  }
}
