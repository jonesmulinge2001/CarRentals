import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Vehicle } from '../../../intrefaces/vehicle.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-booking',
  templateUrl: './new-booking.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class NewBookingComponent implements OnInit {
  bookingForm!: FormGroup;
  vehicle!: Vehicle;
  totalPrice = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      startdate: ['', Validators.required],
      enddate: ['', Validators.required]
    });
  
    const vehicleId = this.route.snapshot.paramMap.get('vehicleId');
    if (vehicleId) {
      this.loadVehicle(vehicleId);
    } else {
      console.warn('No vehicleId found in route');
    }
  }
  

  loadVehicle(id: string): void {
    const token = localStorage.getItem('token');
    this.http.get<{ data: Vehicle }>(`http://localhost:3000/admin/vehicle/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res) => {
        this.vehicle = res.data;

        this.bookingForm.valueChanges.subscribe(() => {
          this.calculateTotal();
        });

        this.calculateTotal();
      },
      error: () => {
        this.toastr.error('Failed to load vehicle');
      }
    });
  }

  calculateTotal(): void {
    const { startdate, enddate } = this.bookingForm.value;

    if (startdate && enddate && this.vehicle && this.vehicle.pricePerHour) {
      const start = new Date(startdate);
      const end = new Date(enddate);

      if (end > start) {
        const hours = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60));
        this.totalPrice = hours * this.vehicle.pricePerHour;
      } else {
        this.totalPrice = 0;
      }
    } else {
      this.totalPrice = 0;
    }

    console.log('Form valid:', this.bookingForm.valid);
    console.log('Form value:', this.bookingForm.value);
    console.log('Vehicle:', this.vehicle);
    console.log('Total price:', this.totalPrice);
  }

  submitBooking(): void {
    console.log('submitBooking called');
    if (this.bookingForm.invalid || this.totalPrice <= 0) {
      this.toastr.warning('Please enter valid booking details');
      return;
    }

    const token = localStorage.getItem('token');
    const data = {
      ...this.bookingForm.value,
      vehicleId: this.vehicle.id,
      totalPrice: this.totalPrice
    };

    this.http.post('http://localhost:3000/customer/bookings', data, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.toastr.success('Booking placed successfully');
        this.router.navigate(['customer/bookings']);
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to book vehicle');
      }
    });
  }
}
