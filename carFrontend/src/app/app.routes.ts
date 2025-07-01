
import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';

// Admin
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin/layout/admin-layout/admin-layout.component';
import { AdminBookingsComponent } from './admin/bookings/bookings.component';
import { DisputesComponent } from './admin/disputes/disputes.component';
import { PaymentsComponent } from './admin/payments/payments.component';
import { VehiclesComponent } from './admin/vehicles/vehicles.component';

// Customer
import { VehicleListComponent } from './customer/dashboard/vehicles/vehicle-list/vehicle-list.component';
import { NewBookingComponent } from './customer/dashboard/bookings/new-booking/new-booking.component';
// import { ModifyBookingComponent } from './customer/dashboard/bookings/modify-booking/modify-booking.component';
import { RentalHistoryComponent } from './customer/dashboard/rentals/rental-history/rental-history.component';
import { CustomerLayoutComponent } from './customer/layout/customer-layout/customer-layout.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { BookingsListComponent } from './customer/dashboard/bookings/booking-list/booking-list.component';
import { AdminReviewsComponent } from './admin/admin-review/admin-review.component';
import { AdminUsersComponent } from './admin/users/users.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  // Public Auth routes
  { path: '', redirectTo: 'customer', pathMatch: 'full' },
{ path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {path: 'profile', component: UserProfileComponent},

  // Admin routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'vehicles', component: VehiclesComponent },
      { path: 'bookings', component: AdminBookingsComponent },
      { path: 'payments', component: PaymentsComponent },
      {path: 'users', component: AdminUsersComponent},
      {path:  'reviews', component: AdminReviewsComponent},
      { path: 'disputes', component: DisputesComponent },
    ],
  },

  // ✅ Customer routes
  {
    path: 'customer',
    component: CustomerLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { 
        path: 'bookings/new/:vehicleId', 
        component: NewBookingComponent,
        canActivate: [AuthGuard]
      },
      { path: 'bookings', component: BookingsListComponent },
      // { path: 'bookings/edit/:id', component: ModifyBookingComponent },
      { path: 'rental-history', component: RentalHistoryComponent },
      { path: 'vehicles', component: VehicleListComponent },
    ],
  },
];
