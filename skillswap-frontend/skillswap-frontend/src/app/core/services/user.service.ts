import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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
    return this.http.get<any>(`${environment.apiUrl}/users/me`).pipe(
      map(r => this.mapToUserProfile(r))
    );
  }

  getUserById(id: number): Observable<UserProfile> {
    return this.http.get<any>(`${environment.apiUrl}/users/${id}`).pipe(
      map(r => this.mapToUserProfile(r))
    );
  }

  searchUsers(query: string): Observable<UserProfile[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/users/search`, {
      params: { q: query }
    }).pipe(
      map(list => list.map(r => this.mapToUserProfile(r)))
    );
  }

  getAllUsers(): Observable<UserProfile[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/users/all`).pipe(
      map(list => list.map(r => this.mapToUserProfile(r)))
    );
  }

  updateMyProfile(request: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.put<any>(`${environment.apiUrl}/users/me`, request).pipe(
      map(r => this.mapToUserProfile(r))
    );
  }

  banearUsuario(id: number, motivo: string, dias: number, horas: number): Observable<any> {
    return this.http.put(`${environment.apiUrl}/users/${id}/ban`, { motivo, dias, horas });
  }

  desbanearUsuario(id: number): Observable<any> {
    return this.http.put(`${environment.apiUrl}/users/${id}/unban`, {});
  }

  private mapToUserProfile(r: any): UserProfile {
    return {
      id:                   r.id,
      nombre:               r.nombre,
      apellido:             r.apellido,
      email:                r.email,
      username:             r.username,
      bio:                  r.bio ?? r.experiencia_breve ?? undefined,
      avatarUrl:            r.avatarUrl ?? r.imagen_perfil ?? undefined,
      ubicacion:            r.ubicacion ?? undefined,
      github:               r.github ?? undefined,
      linkedin:             r.linkedin ?? undefined,
      valoracionMedia:      r.valoracionMedia ?? undefined,
      totalResenas:         r.totalResenas ?? undefined,
      sesionesCompletadas:  r.sesionesCompletadas ?? undefined,
      habilidades:          r.habilidades ?? r.tecnologias_domina ?? [],
      intereses:            r.intereses ?? r.tecnologias_aprende ?? [],
      rachaDiasAprendiendo: r.rachaDiasAprendiendo ?? r.racha_dias_aprendiendo ?? 0,
      rol:                  r.rol ?? 'USER',
      baneadoHasta:         r.baneadoHasta ?? undefined,
      motivoBaneo:          r.motivoBaneo ?? undefined
    };
  }
}