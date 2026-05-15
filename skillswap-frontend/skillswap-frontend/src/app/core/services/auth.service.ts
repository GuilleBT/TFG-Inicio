import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthRequest, AuthResponse, RegisterRequest, UserProfile } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'skillswap_token';
  private readonly USER_KEY  = 'skillswap_user';

  currentUser = signal<UserProfile | null>(this.loadUserFromStorage());

  constructor(private http: HttpClient, private router: Router) {}

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/signin`, request).pipe(
      tap(response => this.handleAuth(response))
    );
  }

  register(request: RegisterRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, request);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  updateCurrentUser(user: UserProfile): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private handleAuth(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);

    const user: UserProfile = {
      id:         response.id,
      username:   response.username,
      email:      response.email,
      nombre:     response.username,
      apellido:   '',
      habilidades: [],
      intereses:   [],
      rachaDiasAprendiendo: undefined,
      rol: response.rol ?? 'USER'
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private loadUserFromStorage(): UserProfile | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }
}