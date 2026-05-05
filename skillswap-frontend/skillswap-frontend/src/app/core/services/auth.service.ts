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

  // ─── CORRECCIÓN 1: URL cambiada de /auth/login → /auth/signin ─────
  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/signin`, request).pipe(
      tap(response => this.handleAuth(response))
    );
  }

  // ─── CORRECCIÓN 2: URL cambiada de /auth/register → /auth/signup ──
  // El backend devuelve un String, no un JWT, así que solo retornamos
  // el observable crudo. El componente redirige a /login tras el éxito.
  register(request: RegisterRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/signup`, request, {
      responseType: 'text'
    });
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

  // ─── CORRECCIÓN 3: El backend devuelve { token, id, username, email }
  // (sin objeto "user" anidado). Construimos el UserProfile manualmente.
  private handleAuth(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);

    const user: UserProfile = {
      id:         response.id,
      username:   response.username,
      email:      response.email,
      nombre:     response.username, // el back no devuelve nombre en signin
      apellido:   '',
      habilidades: [],
      intereses:   []
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