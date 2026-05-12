import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../core/services/user.service';
import { ReviewService } from '../../core/services/review.service';
import { TecnologiaService } from '../../core/services/tecnologia.service';
import { AuthService } from '../../core/services/auth.service';
import { SkillChipComponent } from '../../shared/components/skill-chip/skill-chip.component';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';
import { LoginPromptComponent } from '../../shared/components/login-prompt/login-prompt.component';
import { UserProfile, Tecnologia } from '../../core/models/user.model';
import { Review } from '../../core/models/review.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, RouterLink,
    MatIconModule, MatSnackBarModule,
    SkillChipComponent, StarRatingComponent, LoginPromptComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profile?: UserProfile;
  reviews: Review[] = [];
  tecnologias: Tecnologia[] = [];
  loading = true;
  isOwnProfile = false;
  editMode = false;
  editForm?: FormGroup;
  selectedHabilidades = new Set<number>();
  selectedIntereses = new Set<number>();
  showLoginPrompt = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private reviewService: ReviewService,
    private tecnologiaService: TecnologiaService,
    public authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.tecnologiaService.getAll().subscribe({ next: t => this.tecnologias = t, error: () => {} });
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isOwnProfile = this.authService.currentUser()?.id === +idParam;
        this.loadUserProfile(+idParam);
      } else {
        this.isOwnProfile = true;
        this.loadMyProfile();
      }
    });
  }

  loadMyProfile(): void {
    this.loading = true;
    this.userService.getMyProfile().subscribe({
      next: p => { this.profile = p; this.loadReviews(p.id); this.loading = false; },
      error: () => this.loading = false
    });
  }

  loadUserProfile(id: number): void {
    this.loading = true;
    this.userService.getUserById(id).subscribe({
      next: p => { this.profile = p; this.loadReviews(id); this.loading = false; },
      error: () => this.loading = false
    });
  }

  loadReviews(userId: number): void {
    this.reviewService.getReviewsForUser(userId).subscribe({
      next: r => this.reviews = r, error: () => {}
    });
  }

  requestSession(): void {
    if (!this.authService.isAuthenticated()) {
      this.showLoginPrompt = true;
      return;
    }
    if (this.profile) {
      this.router.navigate(['/sessions'], {
        queryParams: { receptorId: this.profile.id, receptorNombre: this.profile.nombre + ' ' + this.profile.apellido }
      });
    }
  }

  startEdit(): void {
    if (!this.profile) return;
    this.selectedHabilidades = new Set(this.profile.habilidades?.map(h => h.id) ?? []);
    this.selectedIntereses = new Set(this.profile.intereses?.map(i => i.id) ?? []);
    this.editForm = this.fb.group({
      nombre: [this.profile.nombre],
      apellido: [this.profile.apellido],
      bio: [this.profile.bio || ''],
      ubicacion: [this.profile.ubicacion || ''],
      github: [this.profile.github || ''],
      linkedin: [this.profile.linkedin || ''],
    });
    this.editMode = true;
  }

  cancelEdit(): void { this.editMode = false; }

  saveEdit(): void {
    if (!this.editForm) return;
    const request = {
      ...this.editForm.value,
      habilidadesIds: Array.from(this.selectedHabilidades),
      interesesIds: Array.from(this.selectedIntereses),
    };
    this.userService.updateMyProfile(request).subscribe({
      next: p => {
        this.profile = p;
        this.authService.updateCurrentUser(p);
        this.editMode = false;
        this.snackBar.open('Perfil actualizado ✓', '', { duration: 3000 });
      },
      error: () => this.snackBar.open('Error al guardar', '', { duration: 3000 })
    });
  }

  toggleHabilidad(id: number): void {
    if (this.selectedIntereses.has(id)) return;
    this.selectedHabilidades.has(id) ? this.selectedHabilidades.delete(id) : this.selectedHabilidades.add(id);
  }

  toggleInteres(id: number): void {
    if (this.selectedHabilidades.has(id)) return;
    this.selectedIntereses.has(id) ? this.selectedIntereses.delete(id) : this.selectedIntereses.add(id);
  }

  get initials(): string {
    if (!this.profile) return '?';
    return `${this.profile.nombre?.[0] ?? ''}${this.profile.apellido?.[0] ?? ''}`.toUpperCase();
  }

  get averageRating(): number {
    if (!this.reviews.length) return 0;
    return this.reviews.reduce((sum, r) => sum + r.puntuacion, 0) / this.reviews.length;
  }
}
