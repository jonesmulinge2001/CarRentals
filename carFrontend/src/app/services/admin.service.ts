import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  vehicle: {
    title: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AdminReviewService {
  private baseUrl = 'http://localhost:3000/reviews';

  constructor(private http: HttpClient) {}

  getAllReviews(): Observable<Review[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Review[]>(this.baseUrl, { headers });
  }
}
