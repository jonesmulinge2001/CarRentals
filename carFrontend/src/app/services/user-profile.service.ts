// src/app/services/user-profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../../models/user-profile.model';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private readonly baseUrl = 'http://localhost:3000/user-profile';

  constructor(private http: HttpClient) {}

  // 🔍 GET: Fetch profile by userId
  getProfile(userId: string, token: string): Observable<{ message: string; data: UserProfile }> {
    return this.http.get<{ message: string; data: UserProfile }>(`${this.baseUrl}/${userId}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    });
  }

  // 📝 POST: Create or update profile
  createOrUpdateProfile(
    userId: string,
    formData: FormData,
    token: string
  ): Observable<{ message: string; data: UserProfile }> {
    return this.http.post<{ message: string; data: UserProfile }>(
      `${this.baseUrl}/${userId}`,
      formData,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }
  

  // ✏️ PATCH: Update profile
  updateProfile(
    userId: string,
    profileData: Partial<Pick<UserProfile, 'bio' | 'address'>>,
    token: string
  ): Observable<{ message: string; data: UserProfile }> {
    return this.http.patch<{ message: string; data: UserProfile }>(
      `${this.baseUrl}/${userId}`,
      profileData,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      }
    );
  }
}
