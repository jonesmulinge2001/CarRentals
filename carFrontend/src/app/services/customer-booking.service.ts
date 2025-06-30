import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../admin/booking.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerBookingService {
  private readonly BASE_URL = 'http://localhost:3000/customer/bookings';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') ?? '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  getBooking(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.BASE_URL}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateBooking(id: string, data: { enddate: string }): Observable<Booking> {
    return this.http.patch<Booking>(`${this.BASE_URL}/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }
}
