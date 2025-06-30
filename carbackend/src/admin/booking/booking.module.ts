import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { BookingController } from './booking.controller';
import { MailerModule } from 'src/shared/mailer/mailer.module';

@Module({
  imports: [PermissionsModule, MailerModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
