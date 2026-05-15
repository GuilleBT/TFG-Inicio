import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { UserProfile } from '../../core/models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, MatSnackBarModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  users: UserProfile[] = [];
  loading = true;
  searchQuery = '';
  filterEstado: 'todos' | 'activos' | 'baneados' = 'todos';

  showBanModal = false;
  userToBan: UserProfile | null = null;
  banMotivo = '';
  banDias = 1;
  banHoras = 0;
  isBanning = false;

  constructor(
    private userService: UserService,
    public authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated() || this.authService.currentUser()?.rol !== 'ADMIN') {
      this.router.navigate(['/']);
      return;
    }
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: users => { this.users = users; this.loading = false; },
      error: () => { this.loading = false; this.snackBar.open('Error al cargar usuarios', '', { duration: 3000 }); }
    });
  }

  get filteredUsers(): UserProfile[] {
    return this.users.filter(u => {
      const matchSearch = !this.searchQuery.trim() ||
        u.nombre?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        u.apellido?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        u.username?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(this.searchQuery.toLowerCase());

      const isBanned = u.baneadoHasta && new Date(u.baneadoHasta) > new Date();
      const matchEstado =
        this.filterEstado === 'todos' ? true :
        this.filterEstado === 'baneados' ? isBanned :
        !isBanned;

      return matchSearch && matchEstado;
    });
  }

  get totalUsers(): number { return this.users.length; }
  get totalActivos(): number { return this.users.filter(u => !u.baneadoHasta || new Date(u.baneadoHasta) <= new Date()).length; }
  get totalBaneados(): number { return this.users.filter(u => u.baneadoHasta && new Date(u.baneadoHasta) > new Date()).length; }
  get totalAdmins(): number { return this.users.filter(u => u.rol === 'ADMIN').length; }

  isBanned(user: UserProfile): boolean {
    return !!(user.baneadoHasta && new Date(user.baneadoHasta) > new Date());
  }

  abrirModalBan(user: UserProfile): void {
    this.userToBan = user;
    this.banMotivo = '';
    this.banDias = 1;
    this.banHoras = 0;
    this.showBanModal = true;
  }

  cerrarModalBan(): void {
    this.showBanModal = false;
    this.userToBan = null;
  }

  confirmarBan(): void {
    if (!this.userToBan || !this.banMotivo.trim()) return;
    this.isBanning = true;
    this.userService.banearUsuario(this.userToBan.id, this.banMotivo, this.banDias, this.banHoras).subscribe({
      next: () => {
        const idx = this.users.findIndex(u => u.id === this.userToBan!.id);
        if (idx >= 0) {
          const fechaFin = new Date();
          fechaFin.setDate(fechaFin.getDate() + this.banDias);
          fechaFin.setHours(fechaFin.getHours() + this.banHoras);
          this.users[idx] = { ...this.users[idx], baneadoHasta: fechaFin.toISOString(), motivoBaneo: this.banMotivo };
        }
        this.isBanning = false;
        this.cerrarModalBan();
        this.snackBar.open('Usuario baneado ✓', '', { duration: 3000 });
      },
      error: () => { this.isBanning = false; this.snackBar.open('Error al banear', '', { duration: 3000 }); }
    });
  }

  desbanear(user: UserProfile): void {
    this.userService.desbanearUsuario(user.id).subscribe({
      next: () => {
        const idx = this.users.findIndex(u => u.id === user.id);
        if (idx >= 0) this.users[idx] = { ...this.users[idx], baneadoHasta: undefined, motivoBaneo: undefined };
        this.snackBar.open('Usuario desbaneado ✓', '', { duration: 3000 });
      },
      error: () => this.snackBar.open('Error al desbanear', '', { duration: 3000 })
    });
  }

  getInitials(user: UserProfile): string {
    return `${user.nombre?.[0] ?? ''}${user.apellido?.[0] ?? ''}`.toUpperCase();
  }
}