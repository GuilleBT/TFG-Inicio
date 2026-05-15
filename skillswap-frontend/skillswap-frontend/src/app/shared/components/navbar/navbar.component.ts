import { Component, computed, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink, RouterLinkActive, CommonModule,
    MatIconModule, MatMenuModule, MatButtonModule, MatBadgeModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser = computed(() => this.authService.currentUser());
  mobileMenuOpen = false;

  navLinks = [
    { label: 'Matches', icon: 'people', path: '/matching' },
    { label: 'Sesiones', icon: 'event', path: '/sessions' },
    { label: 'Reseñas', icon: 'star', path: '/reviews' },
    { label: 'Minijuegos', icon: 'gamepad', path: '/minijuegos' },
  ];

  // Variables para las notificaciones
  notificaciones: any[] = [];
  cantidadPendientes: number = 0;
  private pollingSub: Subscription | null = null;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // 1. Lógica original de la racha
    if (this.authService.isAuthenticated()) {
      if (this.currentUser()?.rachaDiasAprendiendo == null) {
        this.userService.getMyProfile().subscribe({
          next: user => this.authService.updateCurrentUser(user),
          error: () => {}
        });
      }
    }
    
    // 2. Iniciamos el radar de notificaciones (siempre encendido, pero filtrado)
    this.iniciarRadarNotificaciones();
  }

  ngOnDestroy(): void {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
  }

  iniciarRadarNotificaciones(): void {
    this.pollingSub = interval(5000)
      .pipe(
        startWith(0),
        // MAGIA: El radar solo dispara la petición HTTP si el usuario está autenticado
        filter(() => this.authService.isAuthenticated()),
        switchMap(() => this.http.get<any[]>('http://localhost:8080/api/notificaciones/pendientes'))
      )
      .subscribe({
        next: (data) => {
          this.notificaciones = data;
          this.cantidadPendientes = data.length;
        },
        error: (err) => console.error("Error al cargar notificaciones:", err)
      });
  }

  leerNotificacion(id: number): void {
    this.http.put(`http://localhost:8080/api/notificaciones/${id}/leer`, {}).subscribe(() => {
      this.notificaciones = this.notificaciones.filter(n => n.id !== id);
      this.cantidadPendientes = this.notificaciones.length;
      this.router.navigate(['/sessions']);
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.mobileMenuOpen = false;
  }

  getInitials(): string {
    const user = this.currentUser();
    if (!user) return '?';
    return `${user.nombre?.[0] ?? ''}${user.apellido?.[0] ?? ''}`.toUpperCase();
  }
}