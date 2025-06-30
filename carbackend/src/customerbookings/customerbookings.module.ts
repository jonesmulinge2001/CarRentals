/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [PermissionsModule, MailerModule],
  providers: [BookingService],
  controllers: [BookingController]
})
export class CustomerbookingsModule {}
