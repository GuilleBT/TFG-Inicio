import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatchingService } from '../../core/services/matching.service';
import { TecnologiaService } from '../../core/services/tecnologia.service';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service'; 
import { UserCardComponent } from '../../shared/components/user-card/user-card.component';
import { LoginPromptComponent } from '../../shared/components/login-prompt/login-prompt.component';
import { Match, Tecnologia, UserProfile } from '../../core/models/user.model';

interface TecnologiaGroup {
  label: string;
  items: Tecnologia[];
  expanded: boolean;
}

@Component({
  selector: 'app-matching',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, UserCardComponent, LoginPromptComponent],
  templateUrl: './matching.component.html',
  styleUrl: './matching.component.scss'
})
export class MatchingComponent implements OnInit {
  matches: Match[] = [];
  tecnologias: Tecnologia[] = [];
  loading = true;
  error = '';
  sidebarOpen = true;
  showLoginPrompt = false;
  loginPromptAction = '';

  searchQuery = '';
  soloMatchPerfecto = false;
  filtroEnsena = new Set<number>();
  filtroAprende = new Set<number>();
  gruposEnsena: TecnologiaGroup[] = [];
  gruposAprende: TecnologiaGroup[] = [];

  // Control de Baneos
  showBanModal = false;
  userToBan: UserProfile | null = null;
  banMotivo = '';
  banDias = 1;
  banHoras = 0; // <-- Asegurado en CamelCase
  isBanning = false;

  constructor(
    private matchingService: MatchingService,
    private tecnologiaService: TecnologiaService,
    public authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tecnologiaService.getAll().subscribe({
      next: t => { this.tecnologias = t; this.buildGroups(); },
      error: () => {}
    });
    this.loadMatches();
  }

  get isAdmin(): boolean {
    return this.authService.currentUser()?.rol === 'ADMIN';
  }

  buildGroups(): void {
    const cats: Record<string, string[]> = {
      'Frontend':      ['HTML5','CSS3','JavaScript','TypeScript','Vue 3','React','Angular','Vuetify','Tailwind CSS','Bootstrap','PWA'],
      'Backend':       ['Java','Spring Boot','Node.js','Python','Django','PHP','Laravel','C#','.NET'],
      'Base de datos': ['MySQL','PostgreSQL','MongoDB','Firebase','Redis'],
      'DevOps & Cloud':['Git','GitHub','Docker','AWS','Google Cloud','Linux','Kubernetes','Terraform','Azure'],
      'Móvil':         ['Flutter','React Native','Android','Swift'],
    };

    const build = (): TecnologiaGroup[] => {
      const groups: TecnologiaGroup[] = [];
      const used = new Set<number>();
      for (const [label, nombres] of Object.entries(cats)) {
        const items = this.tecnologias.filter(t => nombres.includes(t.nombre));
        if (items.length) { groups.push({ label, items, expanded: label === 'Frontend' || label === 'Backend' }); items.forEach(i => used.add(i.id)); }
      }
      const otros = this.tecnologias.filter(t => !used.has(t.id));
      if (otros.length) groups.push({ label: 'Otros', items: otros, expanded: false });
      return groups;
    };

    this.gruposEnsena  = build();
    this.gruposAprende = build();
  }

  loadMatches(): void {
    this.loading = true;
    this.error = '';
    this.matchingService.getSuggestedMatches().subscribe({
      next: m => { this.matches = m; this.loading = false; },
      error: () => { this.error = '¿Está el backend corriendo?'; this.loading = false; }
    });
  }

  get activeFiltersCount(): number {
    return (this.soloMatchPerfecto ? 1 : 0) + this.filtroEnsena.size + this.filtroAprende.size;
  }

  get activeFilterChips(): { label: string; type: string; id?: number }[] {
    const chips: { label: string; type: string; id?: number }[] = [];
    if (this.soloMatchPerfecto) chips.push({ label: '⚡ Solo perfectos', type: 'perfecto' });
    this.filtroEnsena.forEach(id => {
      const t = this.tecnologias.find(t => t.id === id);
      if (t) chips.push({ label: `Enseña: ${t.nombre}`, type: 'ensena', id });
    });
    this.filtroAprende.forEach(id => {
      const t = this.tecnologias.find(t => t.id === id);
      if (t) chips.push({ label: `Aprende: ${t.nombre}`, type: 'aprende', id });
    });
    return chips;
  }

  removeChip(chip: { type: string; id?: number }): void {
    if (chip.type === 'perfecto') this.soloMatchPerfecto = false;
    if (chip.type === 'ensena' && chip.id) this.filtroEnsena.delete(chip.id);
    if (chip.type === 'aprende' && chip.id) this.filtroAprende.delete(chip.id);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.soloMatchPerfecto = false;
    this.filtroEnsena.clear();
    this.filtroAprende.clear();
  }

  toggleEnsena(id: number): void {
    this.filtroEnsena.has(id) ? this.filtroEnsena.delete(id) : this.filtroEnsena.add(id);
  }

  toggleAprende(id: number): void {
    this.filtroAprende.has(id) ? this.filtroAprende.delete(id) : this.filtroAprende.add(id);
  }

  get filteredMatches(): Match[] {
    return this.matches.filter(m => {
      const todasHab = m.todasLasHabilidades ?? m.habilidadesQueOfrece ?? [];
      const todosInt = m.todosLosIntereses  ?? m.habilidadesQueNecesita ?? [];

      if (this.soloMatchPerfecto && !m.matchPerfecto) return false;

      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        const inName   = m.usuario.nombre.toLowerCase().includes(q) || m.usuario.apellido.toLowerCase().includes(q) || m.usuario.username.toLowerCase().includes(q);
        const inSkills = [...todasHab, ...todosInt].some(t => t.nombre.toLowerCase().includes(q));
        if (!inName && !inSkills) return false;
      }

      if (this.filtroEnsena.size > 0) {
        const ids = todasHab.map(t => t.id);
        if (![...this.filtroEnsena].some(id => ids.includes(id))) return false;
      }

      if (this.filtroAprende.size > 0) {
        const ids = todosInt.map(t => t.id);
        if (![...this.filtroAprende].some(id => ids.includes(id))) return false;
      }

      return true;
    });
  }

  get perfectMatches(): Match[]  { return this.filteredMatches.filter(m => m.matchPerfecto); }
  get otherMatches(): Match[]    { return this.filteredMatches.filter(m => !m.matchPerfecto); }

  onRequestSession(user: UserProfile): void {
    if (!this.authService.isAuthenticated()) {
      this.loginPromptAction = 'solicitar una sesión';
      this.showLoginPrompt = true;
      return;
    }
    this.router.navigate(['/sessions'], {
      queryParams: { receptorId: user.id, receptorNombre: `${user.nombre} ${user.apellido}` }
    });
  }

  // ── Lógica del Modal de Baneo ─────────────────────

  abrirModalBan(usuario: UserProfile): void {
    this.userToBan = usuario;
    this.banMotivo = '';
    this.banDias = 1;
    this.banHoras = 0; // <-- Reseteo limpio
    this.showBanModal = true;
  }

  cerrarModalBan(): void {
    this.showBanModal = false;
    this.userToBan = null;
  }

  confirmarBan(): void {
    if (!this.userToBan || !this.banMotivo.trim()) return;
    this.isBanning = true;

    // Pasamos banHoras al servicio correctamente
    this.userService.banearUsuario(this.userToBan.id, this.banMotivo, this.banDias, this.banHoras)
      .subscribe({
        next: () => {
          this.matches = this.matches.filter(m => m.usuario.id !== this.userToBan!.id);
          this.isBanning = false;
          this.cerrarModalBan();
        },
        error: () => {
          this.isBanning = false;
          alert('Hubo un error de conexión al intentar aplicar el baneo.');
        }
      });
  }
}