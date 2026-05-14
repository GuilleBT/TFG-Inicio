import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatIconModule, MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    if (this.route.snapshot.queryParams['expired']) {
      this.errorMessage = 'Tu sesión ha expirado. Inicia sesión de nuevo.';
    }
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.errorMessage = '';

    const loginPayload = {
  username: this.form.value.email, // Camuflamos el email como si fuera el username
  password: this.form.value.password
};

this.authService.login(loginPayload).subscribe({
    next: () => {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/matching';
      this.router.navigateByUrl(returnUrl);
    },
    error: (err) => {
      this.loading = false;

      // 👇 EL NUEVO CANDADO DE BANEO (Error 403) 👇
      if (err.status === 403 && err.error && err.error.message === "Tu cuenta está suspendida") {
        
        // Lo mandamos directo a la celda de castigo con los datos
        this.router.navigate(['/banned'], {
          queryParams: {
            motivo: err.error.motivo,
            hasta: err.error.hasta
          }
        });

      } 
      // 👇 TU LÓGICA ORIGINAL PARA EL RESTO DE ERRORES 👇
      else {
        this.errorMessage = err.status === 401
          ? 'Credenciales incorrectas. Revisa tu usuario/email y contraseña.'
          : 'Error al iniciar sesión. Inténtalo de nuevo.';
      }
    }
  });
  }}