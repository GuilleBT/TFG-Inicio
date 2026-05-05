import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReviewService } from '../../core/services/review.service';
import { AuthService } from '../../core/services/auth.service';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';
import { Review } from '../../core/models/review.model';

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

  constructor(
    private reviewService: ReviewService,
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

  ngOnInit(): void { this.loadReviews(); }

  loadReviews(): void {
    this.loading = true;
    this.reviewService.getMyReviews().subscribe({
      next: r => { this.myReviews = r; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onRatingChange(val: number): void {
    this.selectedRating = val;
    this.createForm.patchValue({ puntuacion: val });
  }

  onSubmit(): void {
    if (this.createForm.invalid || this.saving) return;
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
