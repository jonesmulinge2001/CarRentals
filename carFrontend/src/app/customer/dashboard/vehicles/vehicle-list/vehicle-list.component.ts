import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../../../services/vehicle.service';
import { Vehicle } from '../../../intrefaces/vehicle.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-list.component.html',
})
export class VehicleListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  searchTerm = '';
  selectedCategory = '';
  categories: string[] = [];

  constructor(
    private vehicleService: VehicleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vehicleService.getAllVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        this.categories = [...new Set(vehicles.map(v => v.category))];
      },
      error: (err) => {
        console.error('Failed to fetch vehicles:', err);
      }
    });
  }

  bookNow(vehicleId: string): void {
    this.router.navigate(['/customer/bookings/new', vehicleId]);
  }

  get filteredVehicles(): Vehicle[] {
    return this.vehicles.filter(vehicle => {
      const matchesSearch =
        vehicle.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        vehicle.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        vehicle.category.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory =
        !this.selectedCategory || vehicle.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }
}
