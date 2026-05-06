import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { TecnologiaService } from '../../../core/services/tecnologia.service';
import { Tecnologia, RegisterRequest } from '../../../core/models/user.model';
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
  selectedIntereses: Set<number> = new Set();
  
  // Variable para guardar la foto de perfil convertida a texto
  imagenBase64: string | undefined = undefined;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tecnologiaService: TecnologiaService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      // Paso 1
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      
      // Paso 2
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      
      // --- LOS CAMPOS NUEVOS ---
      experienciaBreve: ['', [Validators.maxLength(100)]], // 100 caracteres max, no obligatorio
      tecnologiasDomina: this.fb.array([]) // Array dinámico para las habilidades
    });
  }

  ngOnInit(): void {
    this.tecnologiaService.getAll().subscribe({
      next: (techs) => this.tecnologias = techs,
      error: () => this.tecnologias = this.defaultTecnologias()
    });
  }

  // --- GETTER PARA EL FORMARRAY (Súper útil para el HTML) ---
  get tecnologiasDominaArray(): FormArray {
    return this.form.get('tecnologiasDomina') as FormArray;
  }

  // --- MÉTODO PARA CONVERTIR LA IMAGEN A BASE64 ---
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenBase64 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // --- NUEVA LÓGICA DE HABILIDADES CON FORMARRAY ---
  // ¡OJO! Ahora le pasamos el objeto Tecnologia entero, no solo el ID
  toggleHabilidad(tech: Tecnologia): void {
    const formArray = this.tecnologiasDominaArray;
    // Buscamos si ya hemos añadido esta tecnología
    const index = formArray.controls.findIndex(c => c.value.tecnologiaId === tech.id);

    if (index !== -1) {
      // Si ya estaba, la quitamos (deseleccionar)
      formArray.removeAt(index);
    } else {
      // Si no estaba, creamos su miniformulario dinámico
      const techGroup = this.fb.group({
        tecnologiaId: [tech.id],
        nombre: [tech.nombre], // Guardamos el nombre solo para poder mostrarlo en el HTML
        nivel: ['', Validators.required],
        aniosExperiencia: [0, [Validators.required, Validators.min(0)]],
        puntosFuertes: ['', [Validators.required, Validators.maxLength(30)]]
      });
      formArray.push(techGroup);
    }
  }

  // Comprueba si una tecnología está en el FormArray
  isHabilidadSelected(id: number): boolean {
    return this.tecnologiasDominaArray.controls.some(c => c.value.tecnologiaId === id);
  }

  // --- LÓGICA DE INTERESES (Se queda igual, con un Set) ---
  toggleInteres(id: number): void {
    if (this.selectedIntereses.has(id)) {
      this.selectedIntereses.delete(id);
    } else {
      this.selectedIntereses.add(id);
    }
  }

  isInteresSelected(id: number): boolean {
    return this.selectedIntereses.has(id);
  }

  // --- NAVEGACIÓN ENTRE PASOS ---
  nextStep(): void {
    if (this.step < this.totalSteps) this.step++;
  }

  prevStep(): void {
    if (this.step > 1) this.step--;
  }

  step1Valid(): boolean {
    const c = this.form.controls;
    return !!(c['nombre'].valid && c['apellido'].valid && c['username'].valid);
  }

  step2Valid(): boolean {
    const c = this.form.controls;
    return !!(c['email'].valid && c['password'].valid && c['experienciaBreve'].valid);
  }

  // --- EL ENVÍO FINAL AL BACKEND ---
  onSubmit(): void {
    if (this.form.invalid || this.loading) {
      // Si el formulario es inválido, mostramos un aviso
      this.snackBar.open('Por favor, rellena todos los campos obligatorios correctamente.', 'Cerrar', { duration: 3000 });
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';

    const formValue = this.form.value;

    // Construimos el paquete exacto que espera Java
    const request: RegisterRequest = {
      nombre: formValue.nombre,
      apellido: formValue.apellido,
      username: formValue.username,
      email: formValue.email,
      password: formValue.password,
      experienciaBreve: formValue.experienciaBreve,
      imagenPerfil: this.imagenBase64,
      
      // Limpiamos el 'nombre' temporal y nos quedamos solo con los datos que pide el backend
      tecnologiasDomina: formValue.tecnologiasDomina.map((t: any) => ({
        tecnologiaId: t.tecnologiaId,
        nivel: t.nivel,
        aniosExperiencia: t.aniosExperiencia,
        puntosFuertes: t.puntosFuertes
      })),
      
      // Convertimos el Set de intereses a un Array de números
      tecnologiasAprendeIds: Array.from(this.selectedIntereses)
    };

    this.authService.register(request).subscribe({
      next: () => this.router.navigate(['/matching']),
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.status === 409
          ? 'Este email o username ya está en uso.'
          : 'Error al registrarse. Inténtalo de nuevo.';
        this.step = 2; // Volvemos al paso 2 por si quiere cambiar el correo
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