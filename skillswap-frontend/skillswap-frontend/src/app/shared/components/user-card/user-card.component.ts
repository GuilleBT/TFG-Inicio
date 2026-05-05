import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Match, UserProfile } from '../../../core/models/user.model';
import { SkillChipComponent } from '../skill-chip/skill-chip.component';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, RouterLink, SkillChipComponent, StarRatingComponent, MatIconModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {
  @Input() match?: Match;
  @Input() user?: UserProfile;
  @Input() showMatchScore: boolean = true;
  @Output() requestSession = new EventEmitter<UserProfile>();

  get displayUser(): UserProfile | undefined {
    return this.match?.usuario ?? this.user;
  }

  get initials(): string {
    const u = this.displayUser;
    if (!u) return '?';
    return `${u.nombre?.[0] ?? ''}${u.apellido?.[0] ?? ''}`.toUpperCase();
  }

  onRequestSession(): void {
    if (this.displayUser) {
      this.requestSession.emit(this.displayUser);
    }
  }
}