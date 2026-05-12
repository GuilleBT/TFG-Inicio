import { Component, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';

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
export class NavbarComponent {
  currentUser = computed(() => this.authService.currentUser());
  mobileMenuOpen = false;

  navLinks = [
    { label: 'Matches', icon: 'people', path: '/matching' },
    { label: 'Sesiones', icon: 'event', path: '/sessions' },
    { label: 'Reseñas', icon: 'star', path: '/reviews' },
    { label: 'Minijuegos', icon: 'gamepad', path: '/minijuegos' },
  ];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

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