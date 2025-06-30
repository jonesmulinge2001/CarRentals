import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Booking } from '../admin/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly API = 'http://localhost:3000/admin/bookings';

  constructor(private http: HttpClient) {}

  // Helper method to get headers with Authorization token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // GET all bookings (admin)
  getAllBookings(): Observable<Booking[]> {
    return this.http.get<{ data: Booking[] }>(this.API, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // PATCH update booking status (admin)
  updateBooking(id: string, body: { status: string }): Observable<Booking> {
    return this.http.patch<Booking>(`${this.API}/${id}`, body, {
      headers: this.getAuthHeaders()
    });
  }

  // DELETE soft delete booking (admin)
  deleteBooking(id: string): Observable<any> {
    return this.http.delete(`${this.API}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
