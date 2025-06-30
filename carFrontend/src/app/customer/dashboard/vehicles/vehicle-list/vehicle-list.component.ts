import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../../../services/vehicle.service';
import { Vehicle } from '../../../intrefaces/vehicle.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  imports: [CommonModule],
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[] = [];

  constructor(
    private vehicleService: VehicleService,
    private router: Router
  ) {}

  bookNow(vehicleId: string): void {
    this.router.navigate(['/customer/bookings/new', vehicleId]);
  }
  

  ngOnInit(): void {
    this.vehicleService.getAllVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
      },
      error: (err) => {
        console.error('Failed to fetch vehicles:', err);
      }
    });
  }
}
