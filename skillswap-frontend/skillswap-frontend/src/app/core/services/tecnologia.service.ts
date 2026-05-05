import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tecnologia } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TecnologiaService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Tecnologia[]> {
    return this.http.get<Tecnologia[]>(`${environment.apiUrl}/tecnologias`);
  }

  getById(id: number): Observable<Tecnologia> {
    return this.http.get<Tecnologia>(`${environment.apiUrl}/tecnologias/${id}`);
  }

  create(tecnologia: Partial<Tecnologia>): Observable<Tecnologia> {
    return this.http.post<Tecnologia>(`${environment.apiUrl}/tecnologias`, tecnologia);
  }

  update(id: number, tecnologia: Partial<Tecnologia>): Observable<Tecnologia> {
    return this.http.put<Tecnologia>(`${environment.apiUrl}/tecnologias/${id}`, tecnologia);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/tecnologias/${id}`);
  }
}