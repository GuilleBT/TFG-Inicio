import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatchingService {

  constructor(private http: HttpClient) {}

  getSuggestedMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(`${environment.apiUrl}/matching`);
  }

  getMatchWithUser(userId: number): Observable<Match> {
    return this.http.get<Match>(`${environment.apiUrl}/matching/${userId}`);
  }

  filterMatches(tecnologiaId?: number, minPuntuacion?: number): Observable<Match[]> {
    const params: Record<string, string> = {};
    if (tecnologiaId) params['tecnologiaId'] = tecnologiaId.toString();
    if (minPuntuacion) params['minPuntuacion'] = minPuntuacion.toString();
    return this.http.get<Match[]>(`${environment.apiUrl}/matching`, { params });
  }
}