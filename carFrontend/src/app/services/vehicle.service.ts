import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Vehicle } from '../customer/intrefaces/vehicle.model';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  
  private API = 'http://localhost:3000/admin/vehicle';

  constructor(private http: HttpClient) {}

  getAllVehicles(): Observable<Vehicle[]> {
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<{ data: Vehicle[] }>(this.API, { headers }).pipe(
      map(response => response.data)
    );
  }
}
