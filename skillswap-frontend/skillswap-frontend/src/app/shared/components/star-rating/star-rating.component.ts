import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stars" [class.interactive]="interactive">
      <span
        *ngFor="let star of stars; let i = index"
        class="star"
        [class.filled]="i < (hoveredRating || rating)"
        [class.hovered]="interactive && i < hoveredRating"
        (mouseenter)="interactive && (hoveredRating = i + 1)"
        (mouseleave)="interactive && (hoveredRating = 0)"
        (click)="interactive && selectRating(i + 1)"
      >★</span>
    </div>
    <span *ngIf="showCount && count !== undefined" class="rating-count">({{ count }})</span>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .stars {
      display: flex;
      gap: 2px;

      &.interactive .star {
        cursor: pointer;
        transition: transform 150ms ease;

        &:hover {
          transform: scale(1.2);
        }
      }
    }

    .star {
      font-size: 16px;
      color: var(--border-default);
      transition: color 150ms ease;

      &.filled {
        color: var(--highlight);
      }

      &.hovered {
        color: rgba(251, 191, 36, 0.7);
      }
    }

    .rating-count {
      font-size: 12px;
      color: var(--text-muted);
      font-family: var(--font-mono);
    }
  `]
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Input() interactive: boolean = false;
  @Input() showCount: boolean = false;
  @Input() count?: number;
  @Output() ratingChange = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5];
  hoveredRating = 0;

  selectRating(value: number): void {
    this.rating = value;
    this.ratingChange.emit(value);
  }
}