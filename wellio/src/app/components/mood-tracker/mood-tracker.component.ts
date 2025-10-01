import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mood-tracker',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card class="card mood-card">
      <div class="badge-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm-3.5 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm7 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM7 15h10a5 5 0 00-10 0z"/></svg>
      </div>
      <h2>Mood Tracker</h2>
      <div class="emojis">
        <button mat-raised-button color="primary" (click)="select('😊')">😊</button>
        <button mat-stroked-button (click)="select('😐')">😐</button>
        <button mat-stroked-button color="warn" (click)="select('😞')">😞</button>
      </div>
      <div class="history" *ngIf="history.length">
        <h3>History</h3>
        <ul>
          <li *ngFor="let m of history">{{ m.date }} – {{ m.mood }}</li>
        </ul>
      </div>
    </mat-card>
  `,
  styles: `
    .mood-card { position: relative; overflow: hidden; padding: 20px; color: #0f172a; border-radius: 18px;
      background: #ffffff; border: 1px solid rgba(0,0,0,.06); box-shadow: 0 8px 26px rgba(2, 6, 23, 0.08); }
    h2 { margin: 0 0 12px; font-weight: 900; letter-spacing: .2px; color: #0f172a; padding-left: 72px; min-height: 56px; display: flex; align-items: center; }
    .badge-icon { position: absolute; top: 12px; left: 12px; width: 56px; height: 56px; display: inline-flex; align-items: center; justify-content: center; opacity: .95; color: #7b1fa2; }
    .badge-icon svg { width: 56px; height: 56px; }
    .emojis { display: flex; flex-wrap: wrap; gap: 8px; margin: 8px 0 0; }
    .history { margin-top: 12px; }
    .history h3 { margin: 0 0 6px; }
    ul { padding-left: 16px; margin: 0; }

    @media (max-width: 768px) {
      .mood-card { padding: 16px; }
      h2 { padding-left: 64px; min-height: 56px; }
      .emojis { flex-wrap: wrap; }
      button[mat-raised-button], button[mat-stroked-button] { flex: 1; min-width: 110px; }
    }
  `
})
export class MoodTrackerComponent {
  private readonly key = 'mood.history';
  history: { date: string; mood: string }[] = this.storage.get(this.key, []);

  constructor(private storage: StorageService) {}

  select(mood: string): void {
    const entry = { date: new Date().toLocaleDateString(), mood };
    this.history = [entry, ...this.history].slice(0, 30);
    this.storage.set(this.key, this.history);
  }
}
