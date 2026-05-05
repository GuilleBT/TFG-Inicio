import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatchingService } from '../../core/services/matching.service';
import { TecnologiaService } from '../../core/services/tecnologia.service';
import { UserCardComponent } from '../../shared/components/user-card/user-card.component';
import { Match, Tecnologia, UserProfile } from '../../core/models/user.model';

@Component({
  selector: 'app-matching',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatSnackBarModule, UserCardComponent],
  templateUrl: './matching.component.html',
  styleUrl: './matching.component.scss'
})
export class MatchingComponent implements OnInit {
  matches: Match[] = [];
  tecnologias: Tecnologia[] = [];
  loading = true;
  error = '';
  searchQuery = '';

  constructor(
    private matchingService: MatchingService,
    private tecnologiaService: TecnologiaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTecnologias();
    this.loadMatches();
  }

  loadMatches(): void {
    this.loading = true;
    this.error = '';
    this.matchingService.getSuggestedMatches().subscribe({
      next: (matches) => { this.matches = matches; this.loading = false; },
      error: () => {
        this.error = '¿Está el backend corriendo en localhost:8080?';
        this.loading = false;
      }
    });
  }

  loadTecnologias(): void {
    this.tecnologiaService.getAll().subscribe({ next: (t) => this.tecnologias = t, error: () => {} });
  }

  get filteredMatches(): Match[] {
    if (!this.searchQuery.trim()) return this.matches;
    const q = this.searchQuery.toLowerCase();
    return this.matches.filter(m =>
      m.usuario.nombre.toLowerCase().includes(q) ||
      m.usuario.apellido.toLowerCase().includes(q) ||
      m.usuario.username.toLowerCase().includes(q) ||
      m.habilidadesQueOfrece?.some(t => t.nombre.toLowerCase().includes(q))
    );
  }

  onRequestSession(user: UserProfile): void {
    this.router.navigate(['/sessions'], {
      queryParams: { receptorId: user.id, receptorNombre: user.nombre + ' ' + user.apellido }
    });
  }
}
