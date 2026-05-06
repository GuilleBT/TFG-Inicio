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
}