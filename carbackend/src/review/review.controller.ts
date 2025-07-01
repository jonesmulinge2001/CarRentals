/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from 'src/auth/auth/guards/jwt/jwtAuth.guard';
import { CreateReviewDto } from 'src/dto/create-review.dto';
import { PermissionGuard } from 'src/auth/auth/guards/permission.guard';
import { AuthGuard } from '@nestjs/passport';
import { RequirePermissions } from 'src/auth/decorator/permission.decorator';
import { Permission } from 'src/permissions/permission.enum';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // POST /reviews/ customer
  @Post()
  @UseGuards(JwtAuthGuard)
  async createReview(@Req() req, @Body() dto: CreateReviewDto) {
    const userId = req.user.id; // from decoded JWT token
    return this.reviewService.createReview(userId, dto);
  }
 
  // get all reviews for a specific vehicle
  @Get('/vehicle/:vehicleId') 
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.VIEW_REVIEWS)
  async getReviewsForVehicle(@Param('vehicleId') vehicleId: string) {
    return this.reviewService.getReviewsByVehicle(vehicleId);
  }

  // get all reviews
  @Get()
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @RequirePermissions(Permission.VIEW_REVIEWS)
  async getAllReviews () {
    return this.reviewService.getAllReviews();
  }
}
