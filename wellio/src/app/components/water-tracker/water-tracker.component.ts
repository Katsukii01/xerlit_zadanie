import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-water-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatProgressBarModule, MatButtonModule],
  template: `
    <mat-card class="water-card">
      <div class="badge-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2S5 10 5 14.5A6.5 6.5 0 0011.5 21 6.5 6.5 0 0018 14.5C18 10 12 2 12 2z"/></svg>
      </div>
      <h2>Water</h2>
      <div class="bottle">
        <svg class="bottle-svg" viewBox="0 0 120 200" preserveAspectRatio="xMidYMid meet">
          <defs>
            <clipPath id="bottle-shape">
              <path d="M60 8c-7 0-12 5-12 12v10c0 4-2 6-6 8-8 4-12 12-12 22v88c0 18 16 32 30 32s30-14 30-32v-88c0-10-4-18-12-22-4-2-6-4-6-8V20c0-7-5-12-12-12z"/>
            </clipPath>
          </defs>
          <!-- fill -->
          <g clip-path="url(#bottle-shape)">
            <rect [attr.x]="22" [attr.y]="bottleFillY" [attr.width]="76" [attr.height]="bottleFillH" [attr.rx]="8" fill="#1e88e5"/>
          </g>
          <!-- outline -->
          <path d="M60 8c-7 0-12 5-12 12v10c0 4-2 6-6 8-8 4-12 12-12 22v88c0 18 16 32 30 32s30-14 30-32v-88c0-10-4-18-12-22-4-2-6-4-6-8V20c0-7-5-12-12-12z" fill="none" [attr.stroke]="progress > 0 ? '#1e88e5' : '#94a3b8'" stroke-width="3" stroke-linejoin="round"/>
          <text x="60" y="100" text-anchor="middle" class="bottle-label">{{ animatedProgress | number:'1.0-0' }}%</text>
        </svg>
      </div>
      <div class="controls">
        <button mat-raised-button color="primary" (click)="add(250)">+250 ml</button>
        <button mat-stroked-button color="primary" (click)="add(100)">+100</button>
        <button mat-stroked-button color="primary" (click)="add(500)">+500</button>
        <button mat-stroked-button color="primary" (click)="add(1000)">+1000</button>
        <input class="amount" type="number" inputmode="numeric" min="0" step="10" [(ngModel)]="customAmount" (input)="onAmountInput()" (keydown)="preventMinus($event)" placeholder="ml"/>
        <button mat-stroked-button color="primary" (click)="add(customAmount || 0)">Add</button>
        <button mat-stroked-button color="warn" (click)="reset()">Reset</button>
      </div>
    </mat-card>
  `,
  styles: `
    .water-card { position: relative; overflow: hidden; padding: 20px; text-align: center; color: #0f172a; border-radius: 18px;
      background: #ffffff; border: 1px solid rgba(0,0,0,.06); box-shadow: 0 8px 26px rgba(2, 6, 23, 0.08); }
    h2 { margin: 0 0 12px; font-weight: 900; letter-spacing: .2px; color: #0f172a; }
    .badge-icon { position: absolute; top: 12px; left: 12px; width: 56px; height: 56px; display: inline-flex; align-items: center; justify-content: center; opacity: .95; color: #1e88e5; }
    .badge-icon svg { width: 56px; height: 56px; }
    .controls { display: flex; gap: 8px; justify-content: center; margin-top: 12px; }
    .amount { width: 100px; padding: 6px 8px; border-radius: 8px; border: 1px solid rgba(15,23,42,.2); background: #f8fafc; color: #0f172a; outline: none; }
    .amount::placeholder { color: #64748b; }
    .bottle { display: grid; place-items: center; margin: 6px 0; }
    .bottle .bottle-svg { width: min(48vw, 200px); height: auto; }
    .bottle-label { font-weight: 900; fill: #0b1324; font-size: 18px; }
    @media (max-width: 768px) {
      .controls { flex-wrap: wrap; }
      .amount { flex: 1; min-width: 120px; }
      .bottle .bottle-svg { width: min(70vw, 220px); }
    }
  `
})
export class WaterTrackerComponent implements OnInit {
  private readonly storageKey = 'water.today.ml';
  readonly dailyGoalMl = 2000;
  currentMl = 0;

  constructor(private storage: StorageService) {}

  get progress(): number {
    return Math.min(100, (this.currentMl / this.dailyGoalMl) * 100);
  }

  readonly circumference = 2 * Math.PI * 52;
  dashOffset(percent: number): number {
    return this.circumference * (1 - percent / 100);
  }

  customAmount = 250;
  private readonly innerH = 160; // bottle inner height (matches path)
  private readonly baseY = 186; // bottom of fill area
  get bottleFillH(): number { return Math.max(0, Math.min(this.innerH, this.innerH * this.animatedProgress / 100)); }
  get bottleFillY(): number { return this.baseY - this.bottleFillH; }

  animatedProgress = 0;
  ngOnInit(): void {
    this.currentMl = this.storage.get<number>(this.storageKey, 0);
    this.animateToProgress(this.progress);
  }

  private animateToProgress(target: number): void {
    const start = this.animatedProgress;
    const delta = target - start;
    const duration = 1000;
    const startTs = performance.now();
    const step = (ts: number) => {
      const t = Math.min(1, (ts - startTs) / duration);
      this.animatedProgress = Math.round(start + delta * t);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  add(ml: number): void {
    const safe = Math.max(0, Math.floor(ml));
    if (!safe) return;
    this.currentMl = Math.min(this.dailyGoalMl, this.currentMl + safe);
    this.persist();
    this.animateToProgress(this.progress);
  }

  reset(): void {
    this.currentMl = 0;
    this.persist();
    this.animateToProgress(this.progress);
  }

  private persist(): void {
    this.storage.set<number>(this.storageKey, this.currentMl);
  }

  onAmountInput(): void {
    if (this.customAmount == null) { this.customAmount = 0; return; }
    this.customAmount = Math.max(0, Math.floor(this.customAmount));
  }
  preventMinus(ev: KeyboardEvent): void {
    if (ev.key === '-' || ev.key === '+' ) { ev.preventDefault(); }
  }
}
