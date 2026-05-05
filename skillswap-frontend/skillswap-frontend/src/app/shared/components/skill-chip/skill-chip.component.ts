import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tecnologia } from '../../../core/models/user.model';

export type ChipVariant = 'skill' | 'interest' | 'neutral' | 'match';

@Component({
  selector: 'app-skill-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="chip" [class]="'chip--' + variant">
      <span *ngIf="icon" class="chip-icon">{{ icon }}</span>
      {{ tecnologia?.nombre || label }}
    </span>
  `,
  styles: [`
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 12px;
      border-radius: 9999px;
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.02em;
      white-space: nowrap;
      transition: all 150ms ease;
    }

    .chip--skill {
      background: var(--accent-dim);
      color: var(--accent);
      border: 1px solid rgba(94, 234, 212, 0.2);
    }

    .chip--interest {
      background: var(--highlight-dim);
      color: var(--highlight);
      border: 1px solid rgba(251, 191, 36, 0.2);
    }

    .chip--neutral {
      background: var(--border-subtle);
      color: var(--text-secondary);
      border: 1px solid var(--border-default);
    }

    .chip--match {
      background: rgba(52, 211, 153, 0.1);
      color: var(--success);
      border: 1px solid rgba(52, 211, 153, 0.2);
    }

    .chip-icon {
      font-size: 13px;
    }
  `]
})
export class SkillChipComponent {
  @Input() tecnologia?: Tecnologia;
  @Input() label?: string;
  @Input() variant: ChipVariant = 'neutral';
  @Input() icon?: string;
}