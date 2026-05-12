import { Component, computed, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
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
export class NavbarComponent implements OnInit {
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
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated() && this.currentUser()?.rachaDiasAprendiendo == null) {
      this.userService.getMyProfile().subscribe({
        next: user => this.authService.updateCurrentUser(user),
        error: () => {}
      });
    }
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