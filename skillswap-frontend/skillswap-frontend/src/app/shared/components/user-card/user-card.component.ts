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
  @Input() showMatchScore = true;
  @Output() requestSession = new EventEmitter<UserProfile>();

  get displayUser(): UserProfile | undefined {
    return this.match?.usuario ?? this.user;
  }

  get initials(): string {
    const u = this.displayUser;
    if (!u) return '?';
    return `${u.nombre?.[0] ?? ''}${u.apellido?.[0] ?? ''}`.toUpperCase();
  }

  get isPerfectMatch(): boolean {
    return !!this.match?.matchPerfecto;
  }

  get matchScore(): number {
    return this.match?.puntuacionMatch ?? 0;
  }

  get teachSkills() {
    if (this.match?.habilidadesQueOfrece?.length) return this.match.habilidadesQueOfrece.slice(0, 4);
    return this.match?.todasLasHabilidades?.slice(0, 4) ?? this.displayUser?.habilidades?.slice(0, 4) ?? [];
  }

  get learnSkills() {
    if (this.match?.habilidadesQueNecesita?.length) return this.match.habilidadesQueNecesita.slice(0, 4);
    return this.displayUser?.intereses?.slice(0, 4) ?? [];
  }

  get hasRealMatch(): boolean {
    return (this.match?.habilidadesQueOfrece?.length ?? 0) > 0 ||
           (this.match?.habilidadesQueNecesita?.length ?? 0) > 0;
  }

  get avatarColor(): string {
    const colors = ['#5eead4', '#fbbf24', '#60a5fa', '#f472b6', '#a78bfa', '#34d399', '#fb923c'];
    const u = this.displayUser;
    if (!u) return colors[0];
    const index = (u.nombre?.charCodeAt(0) ?? 0) % colors.length;
    return colors[index];
  }

  onRequestSession(): void {
    if (this.displayUser) this.requestSession.emit(this.displayUser);
  }
}
