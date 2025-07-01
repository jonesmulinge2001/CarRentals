/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
  imports: [PermissionsModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
