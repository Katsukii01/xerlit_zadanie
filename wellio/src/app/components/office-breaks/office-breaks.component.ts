import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-office-breaks',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  template: `
    <mat-card class="card breaks-card">
      <div class="badge-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 20a8 8 0 110-16 8 8 0 010 16zm1-13v5l4 2"/></svg>
      </div>
      <h2>Office Breaks</h2>
      <p class="meta">Reminder timer: {{ remaining }}s</p>
      <div class="row">
        <button mat-raised-button color="primary" (click)="start()">Start 20m</button>
        <button mat-stroked-button (click)="stop()">Stop</button>
        <button mat-stroked-button color="warn" (click)="reset()">Reset</button>
      </div>
      <ul>
        <li>Stretch neck and shoulders</li>
        <li>Deep breathing 1 minute</li>
        <li>Stand and walk 2 minutes</li>
      </ul>
    </mat-card>
  `,
  styles: `
    .breaks-card { position: relative; overflow: hidden; padding: 20px; color: #0f172a; border-radius: 18px;
      background: #ffffff; border: 1px solid rgba(0,0,0,.06); box-shadow: 0 8px 26px rgba(2, 6, 23, 0.08); }
    h2 { margin: 0 0 12px; font-weight: 900; letter-spacing: .2px; color: #0f172a; padding-left: 72px; min-height: 56px; display: flex; align-items: center; }
    .badge-icon { position: absolute; top: 12px; left: 12px; width: 56px; height: 56px; display: inline-flex; align-items: center; justify-content: center; opacity: .95; color: var(--torii-red); }
    .badge-icon svg { width: 56px; height: 56px; }
    .meta { margin: 0 0 8px; opacity: .8; }
    .row { display: flex; gap: 8px; margin: 8px 0 12px; flex-wrap: wrap; }
    ul { padding-left: 16px; margin: 0; }

    @media (max-width: 768px) {
      .breaks-card { padding: 16px; }
      h2 { padding-left: 64px; min-height: 56px; }
      button[mat-raised-button], button[mat-stroked-button] { flex: 1; min-width: 110px; }
    }
  `
})
export class OfficeBreaksComponent {
  private timer: any;
  readonly duration = 20 * 60; // 20 minutes in seconds
  remaining = this.duration;

  start(): void {
    this.stop();
    this.timer = setInterval(() => {
      this.remaining = Math.max(0, this.remaining - 1);
      if (this.remaining === 0) {
        this.stop();
        alert('Time for a break!');
      }
    }, 1000);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  reset(): void {
    this.stop();
    this.remaining = this.duration;
  }
}
