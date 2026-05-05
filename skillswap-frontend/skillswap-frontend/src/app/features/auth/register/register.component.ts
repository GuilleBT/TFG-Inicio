import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { TecnologiaService } from '../../../core/services/tecnologia.service';
import { Tecnologia } from '../../../core/models/user.model';
import { SkillChipComponent } from '../../../shared/components/skill-chip/skill-chip.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatIconModule, MatSnackBarModule, SkillChipComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  step = 1;
  totalSteps = 3;
  form: FormGroup;
  loading = false;
  showPassword = false;
  errorMessage = '';

  tecnologias: Tecnologia[] = [];
  selectedHabilidades: Set<number> = new Set();
  selectedIntereses: Set<number> = new Set();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tecnologiaService: TecnologiaService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    this.tecnologiaService.getAll().subscribe({
      next: (techs) => this.tecnologias = techs,
      error: () => this.tecnologias = this.defaultTecnologias()
    });
  }

  nextStep(): void {
    if (this.step < this.totalSteps) this.step++;
  }

  prevStep(): void {
    if (this.step > 1) this.step--;
  }

  toggleHabilidad(id: number): void {
    if (this.selectedHabilidades.has(id)) {
      this.selectedHabilidades.delete(id);
    } else {
      this.selectedHabilidades.add(id);
    }
  }

  toggleInteres(id: number): void {
    if (this.selectedIntereses.has(id)) {
      this.selectedIntereses.delete(id);
    } else {
      this.selectedIntereses.add(id);
    }
  }

  isHabilidadSelected(id: number): boolean {
    return this.selectedHabilidades.has(id);
  }

  isInteresSelected(id: number): boolean {
    return this.selectedIntereses.has(id);
  }

  step1Valid(): boolean {
    const c = this.form.controls;
    return !!(c['nombre'].valid && c['apellido'].valid && c['username'].valid);
  }

  step2Valid(): boolean {
    const c = this.form.controls;
    return !!(c['email'].valid && c['password'].valid);
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.errorMessage = '';

    const request = {
      ...this.form.value,
      habilidadesIds: Array.from(this.selectedHabilidades),
      interesesIds: Array.from(this.selectedIntereses)
    };

    this.authService.register(request).subscribe({
      next: () => this.router.navigate(['/matching']),
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.status === 409
          ? 'Este email o username ya está en uso.'
          : 'Error al registrarse. Inténtalo de nuevo.';
        this.step = 2;
      }
    });
  }

  private defaultTecnologias(): Tecnologia[] {
    const names = ['Java', 'Spring Boot', 'Angular', 'React', 'Vue.js', 'TypeScript',
      'Python', 'Node.js', 'Docker', 'Kubernetes', 'MySQL', 'MongoDB',
      'Git', 'AWS', 'Linux', 'C#', '.NET', 'PHP', 'Laravel', 'Flutter'];
    return names.map((nombre, i) => ({ id: i + 1, nombre }));
  }
}