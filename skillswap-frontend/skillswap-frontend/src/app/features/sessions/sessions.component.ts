import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { SessionService } from '../../core/services/session.service';
import { TecnologiaService } from '../../core/services/tecnologia.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { Session } from '../../core/models/session.model';
import { Tecnologia, UserProfile } from '../../core/models/user.model';

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
  createForm: FormGroup;

  userSearchQuery = '';
  userSearchResults: UserProfile[] = [];
  selectedReceptor: UserProfile | null = null;
  private searchSubject = new Subject<string>();

  constructor(
    private sessionService: SessionService,
    private tecnologiaService: TecnologiaService,
    private userService: UserService,
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
      telefonoContacto: [''], // NUEVO: Campo para WhatsApp
    });
  }

  ngOnInit(): void {
    this.tecnologiaService.getAll().subscribe({ next: t => this.tecnologias = t, error: () => {} });

    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(q => {
      if (q.trim().length < 2) { this.userSearchResults = []; return; }
      this.userService.searchUsers(q).subscribe({
        next: results => this.userSearchResults = results.filter(u => u.id !== this.authService.currentUser()?.id),
        error: () => {}
      });
    });

    this.route.queryParams.subscribe(params => {
      if (params['receptorId']) {
        const receptorId = +params['receptorId'];
        this.createForm.patchValue({ receptorId });
        this.showForm = true;
        this.userService.getUserById(receptorId).subscribe({
          next: u => { this.selectedReceptor = u; },
          error: () => {
            const nombre = params['receptorNombre'] || '';
            if (nombre) {
              // Por esta otra (le hemos añadido el rol al final):
this.selectedReceptor = { id: receptorId, nombre: nombre.split(' ')[0], apellido: nombre.split(' ')[1] ?? '', email: '', username: '', habilidades: [], intereses: [], rol: 'USER' };
            }
          }
        });
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

  onUserSearch(): void {
    this.searchSubject.next(this.userSearchQuery);
  }

  selectReceptor(u: UserProfile): void {
    this.selectedReceptor = u;
    this.createForm.patchValue({ receptorId: u.id });
    this.userSearchResults = [];
    this.userSearchQuery = '';
  }

  clearReceptor(): void {
    this.selectedReceptor = null;
    this.createForm.patchValue({ receptorId: '' });
  }

  get filteredSessions(): Session[] {
    if (this.filterEstado === 'TODAS') return this.sessions;
    return this.sessions.filter(s => s.estado === this.filterEstado);
  }

  onCreateSubmit(): void {
    if (this.createForm.invalid || this.saving || !this.selectedReceptor) return;
    this.saving = true;
    const v = this.createForm.value;
    const request: any = {
      receptorId: +v.receptorId,
      titulo: v.titulo,
      descripcion: v.descripcion,
      fechaHora: new Date(v.fechaHora).toISOString().replace('Z', ''),
      duracionMinutos: +v.duracionMinutos,
      enlaceMeeting: v.enlaceMeeting || undefined,
      enlaceGithub: v.enlaceGithub || undefined,
      tecnologiaId: v.tecnologiaId ? +v.tecnologiaId : undefined,
      telefonoContacto: v.telefonoContacto || undefined // NUEVO: Lo enviamos al backend
    };
    this.sessionService.createSession(request).subscribe({
      next: s => {
        this.sessions = [s, ...this.sessions];
        this.showForm = false;
        this.saving = false;
        this.selectedReceptor = null;
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

  // NUEVO: Función para abrir WhatsApp
  contactarPorWhatsApp(telefono: string | undefined): void {
    if (!telefono) return;
    let numeroLimpio = telefono.replace(/\D/g, '');
    if (numeroLimpio.length === 9) {
      numeroLimpio = '34' + numeroLimpio;
    }
    const url = `https://wa.me/${numeroLimpio}`;
    window.open(url, '_blank');
  }
}