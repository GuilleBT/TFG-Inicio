import { Component, OnInit } from '@angular/core'; // Añade OnInit
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AuthService } from './core/services/auth.service';
import { UserService } from './core/services/user.service'; // Importa tu UserService
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit { // Implementa OnInit
  
  constructor(
    public authService: AuthService,
    private userService: UserService // Inyecta el UserService
  ) {}

  ngOnInit(): void {
    this.verificarEstadoBaneo();
  }

  verificarEstadoBaneo(): void {
    // Si no hay nadie logueado, no hacemos nada
    if (!this.authService.isAuthenticated()) return;

    // Pedimos nuestro propio perfil para ver si el rol o el baneo han cambiado
    this.userService.getMyProfile().subscribe({
      next: (perfil) => {
        if (perfil.baneadoHasta) {
          const fechaFinBaneo = new Date(perfil.baneadoHasta);
          const ahora = new Date();

          if (fechaFinBaneo > ahora) {
            alert(`🚨 ATENCIÓN: Has sido baneado.\nMotivo: ${perfil.motivoBaneo}\nTu acceso está restringido hasta: ${fechaFinBaneo.toLocaleString()}`);
            this.authService.logout(); // 🚪 ¡A la calle!
          }
        }
      },
      error: (err) => {
        // Si el token ya no es válido (por ejemplo, baneo total en backend), echamos al usuario
        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
        }
      }
    });
  }
}