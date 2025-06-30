/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth/auth.module';
import { UserController } from './admin/user.controller';
import { UserService } from './admin/user.service';
import { VehicleController } from './admin/vehicle.controller';
import { VehicleService } from './admin/vehicle.service';
import { PermissionsModule } from './permissions/permissions.module';
import { VehicleModule } from './admin/vehicle.module';
import { CloudinaryModule } from './shared/cloudinary/cloudinary.module';
import { AdminModule } from './admin/admin.module';
import { CustomerbookingsModule } from './customerbookings/customerbookings.module';
import { BookingModule } from './admin/booking/booking.module';

@Module({
  imports: [
    AuthModule, 
    BookingModule,
    BookingModule,
    AdminModule,
    PermissionsModule, 
    VehicleModule, 
    CloudinaryModule, CustomerbookingsModule],
  controllers: [AppController, UserController, VehicleController],
  providers: [AppService, UserService, VehicleService],
})
export class AppModule {}
