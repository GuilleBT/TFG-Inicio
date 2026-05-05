import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review, CreateReviewRequest } from '../models/review.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) {}

  getReviewsForUser(userId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiUrl}/reviews/user/${userId}`);
  }

  getMyReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiUrl}/reviews/mine`);
  }

  createReview(request: CreateReviewRequest): Observable<Review> {
    return this.http.post<Review>(`${environment.apiUrl}/reviews`, request);
  }

  updateReview(id: number, request: Partial<CreateReviewRequest>): Observable<Review> {
    return this.http.put<Review>(`${environment.apiUrl}/reviews/${id}`, request);
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/reviews/${id}`);
  }
}