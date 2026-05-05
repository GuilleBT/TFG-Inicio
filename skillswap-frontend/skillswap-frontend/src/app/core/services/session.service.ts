import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Session, CreateSessionRequest, UpdateSessionRequest } from '../models/session.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http: HttpClient) {}

  getMySessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${environment.apiUrl}/sessions`);
  }

  getSessionById(id: number): Observable<Session> {
    return this.http.get<Session>(`${environment.apiUrl}/sessions/${id}`);
  }

  createSession(request: CreateSessionRequest): Observable<Session> {
    return this.http.post<Session>(`${environment.apiUrl}/sessions`, request);
  }

  updateSession(id: number, request: UpdateSessionRequest): Observable<Session> {
    return this.http.put<Session>(`${environment.apiUrl}/sessions/${id}`, request);
  }

  confirmSession(id: number): Observable<Session> {
    return this.http.patch<Session>(`${environment.apiUrl}/sessions/${id}/confirm`, {});
  }

  cancelSession(id: number): Observable<Session> {
    return this.http.patch<Session>(`${environment.apiUrl}/sessions/${id}/cancel`, {});
  }

  completeSession(id: number): Observable<Session> {
    return this.http.patch<Session>(`${environment.apiUrl}/sessions/${id}/complete`, {});
  }

  deleteSession(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/sessions/${id}`);
  }
}