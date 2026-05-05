import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/user.model';
import { environment } from '../../../environments/environment';

export interface UpdateProfileRequest {
  nombre?: string;
  apellido?: string;
  bio?: string;
  ubicacion?: string;
  github?: string;
  linkedin?: string;
  habilidadesIds?: number[];
  interesesIds?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${environment.apiUrl}/users/me`);
  }

  getUserById(id: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${environment.apiUrl}/users/${id}`);
  }

  updateMyProfile(request: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${environment.apiUrl}/users/me`, request);
  }

  updateAvatar(file: File): Observable<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<{ avatarUrl: string }>(`${environment.apiUrl}/users/me/avatar`, formData);
  }

  searchUsers(query: string): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${environment.apiUrl}/users/search`, {
      params: { q: query }
    });
  }
}