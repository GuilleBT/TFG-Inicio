import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ReviewService } from '../../core/services/review.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';
import { Review } from '../../core/models/review.model';
import { UserProfile } from '../../core/models/user.model';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, MatSnackBarModule, StarRatingComponent],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class ReviewsComponent implements OnInit {
  myReviews: Review[] = [];
  loading = true;
  showForm = false;
  saving = false;
  selectedRating = 0;
  createForm: FormGroup;

  userSearchQuery = '';
  userSearchResults: UserProfile[] = [];
  selectedUser: UserProfile | null = null;
  private searchSubject = new Subject<string>();

  constructor(
    private reviewService: ReviewService,
    private userService: UserService,
    public authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.createForm = this.fb.group({
      receptorId: ['', Validators.required],
      puntuacion: [0, [Validators.required, Validators.min(1)]],
      comentario: ['', [Validators.required, Validators.minLength(10)]],
      sesionId: [''],
    });
  }

  ngOnInit(): void {
    this.loadReviews();
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(q => {
      if (q.trim().length < 2) { this.userSearchResults = []; return; }
      this.userService.searchUsers(q).subscribe({
        next: results => this.userSearchResults = results.filter(u => u.id !== this.authService.currentUser()?.id),
        error: () => {}
      });
    });
  }

  loadReviews(): void {
    this.loading = true;
    this.reviewService.getMyReviews().subscribe({
      next: r => { this.myReviews = r; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onUserSearch(): void {
    this.searchSubject.next(this.userSearchQuery);
  }

  selectUser(u: UserProfile): void {
    this.selectedUser = u;
    this.createForm.patchValue({ receptorId: u.id });
    this.userSearchResults = [];
    this.userSearchQuery = '';
  }

  clearSelectedUser(): void {
    this.selectedUser = null;
    this.createForm.patchValue({ receptorId: '' });
  }

  onRatingChange(val: number): void {
    this.selectedRating = val;
    this.createForm.patchValue({ puntuacion: val });
  }

  onSubmit(): void {
    if (this.createForm.invalid || this.saving || !this.selectedUser) return;
    this.saving = true;
    const v = this.createForm.value;
    const request = {
      receptorId: +v.receptorId,
      puntuacion: +v.puntuacion,
      comentario: v.comentario,
      ...(v.sesionId ? { sesionId: +v.sesionId } : {})
    };
    this.reviewService.createReview(request).subscribe({
      next: r => {
        this.myReviews = [r, ...this.myReviews];
        this.showForm = false;
        this.saving = false;
        this.selectedRating = 0;
        this.selectedUser = null;
        this.createForm.reset();
        this.snackBar.open('Reseña publicada ✓', '', { duration: 3000 });
      },
      error: () => { this.saving = false; this.snackBar.open('Error al publicar la reseña', '', { duration: 3000 }); }
    });
  }

  deleteReview(id: number): void {
    this.reviewService.deleteReview(id).subscribe({
      next: () => { this.myReviews = this.myReviews.filter(r => r.id !== id); this.snackBar.open('Reseña eliminada', '', { duration: 2000 }); },
      error: () => this.snackBar.open('Error al eliminar', '', { duration: 2000 })
    });
  }
}
