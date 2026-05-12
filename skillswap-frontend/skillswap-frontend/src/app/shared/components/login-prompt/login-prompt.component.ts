import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login-prompt',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <button class="modal-close" (click)="close.emit()">
          <mat-icon>close</mat-icon>
        </button>

        <div class="modal-icon">🚀</div>
        <h2 class="modal-title">¡Un paso más!</h2>
        <p class="modal-subtitle">
          Para <strong>{{ actionLabel }}</strong> necesitas una cuenta gratuita.
          Solo te lleva 30 segundos.
        </p>

        <div class="modal-actions">
          <button class="btn btn-primary btn-lg" (click)="goRegister()">
            <mat-icon>person_add</mat-icon>
            Crear cuenta gratis
          </button>
          <button class="btn btn-outline btn-lg" (click)="goLogin()">
            Ya tengo cuenta — Entrar
          </button>
        </div>

        <p class="modal-note">
          <mat-icon class="note-icon">lock_open</mat-icon>
          Puedes seguir explorando sin cuenta
        </p>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.15s ease;
    }
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

    .modal-card {
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 2.5rem;
      max-width: 420px;
      width: 90%;
      text-align: center;
      position: relative;
      animation: slideUp 0.2s ease;
    }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }

    .modal-close {
      position: absolute; top: 1rem; right: 1rem;
      background: none; border: none; cursor: pointer;
      color: var(--text-muted); padding: 4px;
      border-radius: 50%;
      display: flex; align-items: center;
      transition: background 0.15s;
    }
    .modal-close:hover { background: var(--surface-3); }

    .modal-icon { font-size: 3rem; margin-bottom: 1rem; }

    .modal-title {
      font-size: 1.6rem; font-weight: 700;
      color: var(--text-primary); margin: 0 0 0.75rem;
    }

    .modal-subtitle {
      color: var(--text-muted); line-height: 1.6;
      margin: 0 0 2rem;
    }
    .modal-subtitle strong { color: var(--accent); }

    .modal-actions {
      display: flex; flex-direction: column; gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .btn-lg { padding: 0.875rem 1.5rem; font-size: 1rem; border-radius: 12px; }
    .btn { display: flex; align-items: center; justify-content: center; gap: 0.5rem;
           cursor: pointer; font-weight: 600; transition: all 0.15s; border: none; }
    .btn-primary { background: var(--accent); color: #000; }
    .btn-primary:hover { filter: brightness(1.1); }
    .btn-outline { background: transparent; color: var(--text-primary);
                   border: 1.5px solid var(--border); }
    .btn-outline:hover { border-color: var(--accent); color: var(--accent); }

    .modal-note {
      display: flex; align-items: center; justify-content: center; gap: 0.4rem;
      color: var(--text-muted); font-size: 0.8rem; margin: 0;
    }
    .note-icon { font-size: 1rem; }
  `]
})
export class LoginPromptComponent {
  @Input() actionLabel = 'realizar esta acción';
  @Output() close = new EventEmitter<void>();

  constructor(private router: Router) {}

  goRegister(): void {
    this.close.emit();
    this.router.navigate(['/register']);
  }

  goLogin(): void {
    this.close.emit();
    this.router.navigate(['/login']);
  }
}
