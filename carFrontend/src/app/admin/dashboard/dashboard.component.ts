import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CardComponent } from '../shared/card/card.component';
import { DashboardStats } from './dashboard-stats';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);

  totalUsers = 0;
  totalVehicles = 0;
  bookedVehicles = 0;
  availableVehicles = 0;
  revenue = 0;
  totalBookings = 0;
  totalPayments = 0;
  activeRentals = 0;

  ngOnInit(): void {
    this.getDashboardStats();
  }

  getDashboardStats() {
    this.http.get<DashboardStats>('http://localhost:3000/admin/dashboard').subscribe(
      (res) => {
        this.totalUsers = res.totalUsers;
        this.totalVehicles = res.totalVehicles;
        this.bookedVehicles = res.bookedVehicles;
        this.availableVehicles = res.availableVehicles;
        this.revenue = res.revenue;
        this.totalBookings = res.totalBookings;
        this.totalPayments = res.totalPayments;
        this.activeRentals = res.activeRentals;
      },
      (err) => {
        console.error('Dashboard data error', err);
      }
    );
  }
}