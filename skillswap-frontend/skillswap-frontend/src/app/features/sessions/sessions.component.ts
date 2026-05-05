import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from '../../core/services/session.service';
import { TecnologiaService } from '../../core/services/tecnologia.service';
import { AuthService } from '../../core/services/auth.service';
import { Session } from '../../core/models/session.model';
import { Tecnologia } from '../../core/models/user.model';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, MatSnackBarModule, DatePipe],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.scss'
})
export class SessionsComponent implements OnInit {
  sessions: Session[] = [];
  tecnologias: Tecnologia[] = [];
  loading = true;
  showForm = false;
  saving = false;
  filterEstado = 'TODAS';
  receptorNombreParam = '';
  createForm: FormGroup;

  constructor(
    private sessionService: SessionService,
    private tecnologiaService: TecnologiaService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.createForm = this.fb.group({
      receptorId: ['', Validators.required],
      tecnologiaId: [''],
      titulo: ['', Validators.required],
      descripcion: [''],
      fechaHora: ['', Validators.required],
      duracionMinutos: [60, [Validators.required, Validators.min(15)]],
      enlaceMeeting: [''],
      enlaceGithub: [''],
    });
  }

  ngOnInit(): void {
    this.tecnologiaService.getAll().subscribe({ next: t => this.tecnologias = t, error: () => {} });
    this.route.queryParams.subscribe(params => {
      if (params['receptorId']) {
        this.createForm.patchValue({ receptorId: +params['receptorId'] });
        this.receptorNombreParam = params['receptorNombre'] || '';
        this.showForm = true;
      }
    });
    this.loadSessions();
  }

  loadSessions(): void {
    this.loading = true;
    this.sessionService.getMySessions().subscribe({
      next: s => { this.sessions = s; this.loading = false; },
      error: () => this.loading = false
    });
  }

  get filteredSessions(): Session[] {
    if (this.filterEstado === 'TODAS') return this.sessions;
    return this.sessions.filter(s => s.estado === this.filterEstado);
  }

  onCreateSubmit(): void {
    if (this.createForm.invalid || this.saving) return;
    this.saving = true;
    const v = this.createForm.value;
    
    // Forzamos el tipo 'any' para evitar conflictos estrictos con la interfaz CreateSessionRequest
    const request: any = {
      receptorId: +v.receptorId,
      titulo: v.titulo,
      descripcion: v.descripcion,
      fechaHora: new Date(v.fechaHora).toISOString().replace('Z',''),
      duracionMinutos: +v.duracionMinutos,
      enlaceMeeting: v.enlaceMeeting || undefined,
      enlaceGithub: v.enlaceGithub || undefined,
      tecnologiaId: v.tecnologiaId ? +v.tecnologiaId : undefined
    };
    
    this.sessionService.createSession(request).subscribe({
      next: s => {
        this.sessions = [s, ...this.sessions];
        this.showForm = false;
        this.saving = false;
        this.createForm.reset({ duracionMinutos: 60 });
        this.snackBar.open('Sesión creada ✓', '', { duration: 3000 });
      },
      error: () => { this.saving = false; this.snackBar.open('Error al crear la sesión', '', { duration: 3000 }); }
    });
  }

  confirm(s: Session): void {
    this.sessionService.confirmSession(s.id).subscribe({
      next: updated => this.replaceSession(updated),
      error: () => this.snackBar.open('Error', '', { duration: 2000 })
    });
  }

  complete(s: Session): void {
    this.sessionService.completeSession(s.id).subscribe({
      next: updated => this.replaceSession(updated),
      error: () => this.snackBar.open('Error', '', { duration: 2000 })
    });
  }

  cancel(s: Session): void {
    this.sessionService.cancelSession(s.id).subscribe({ next: updated => this.replaceSession(updated), error: () => {} });
  }

  private replaceSession(s: Session): void {
    const i = this.sessions.findIndex(x => x.id === s.id);
    if (i >= 0) this.sessions = [...this.sessions.slice(0, i), s, ...this.sessions.slice(i + 1)];
  }

  isMyRequest(s: Session): boolean {
    return s.solicitanteId === this.authService.currentUser()?.id;
  }

  statusLabel(status: string): string {
    const m: Record<string, string> = { PENDIENTE: 'Pendiente', CONFIRMADA: 'Confirmada', COMPLETADA: 'Completada', CANCELADA: 'Cancelada' };
    return m[status] ?? status;
  }
}