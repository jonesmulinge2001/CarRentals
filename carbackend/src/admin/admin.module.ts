/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { BookingModule } from './booking/booking.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [BookingModule],
})
export class AdminModule {}
