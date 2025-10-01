import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-habit-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatListModule, MatCheckboxModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule],
  template: `
    <mat-card class="card habit-card">
      <div class="badge-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z"/></svg>
      </div>
      <h2>Habits</h2>

      <div class="add-row">
        <mat-form-field appearance="outline">
          <mat-label>New habit</mat-label>
          <input matInput [(ngModel)]="newHabit" (keyup.enter)="addHabit()" />
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="addHabit()">Add</button>
      </div>

      <mat-selection-list class="list">
        <mat-list-option *ngFor="let habit of habits" [selected]="completed[habit]" (selectedChange)="toggle(habit, $event)">
          <div class="habit-row">
            <span class="name">{{ habit }}</span>
            <button mat-icon-button color="warn" aria-label="Delete habit" (click)="$event.stopPropagation(); removeHabit(habit)">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </mat-list-option>
      </mat-selection-list>

      <div class="row">
        <div class="stat">Progress: {{ progress }}%</div>
        <button mat-stroked-button color="warn" (click)="resetToday()">Reset today</button>
      </div>
    </mat-card>
  `,
  styles: `
    .habit-card { position: relative; overflow: hidden; padding: 20px; color: #0f172a; border-radius: 18px;
      background: #ffffff; border: 1px solid rgba(0,0,0,.06); box-shadow: 0 8px 26px rgba(2, 6, 23, 0.08); }
    h2 { margin: 0 0 12px; font-weight: 900; letter-spacing: .2px; color: #0f172a; padding-left: 72px; min-height: 56px; display: flex; align-items: center; }
    .badge-icon { position: absolute; top: 12px; left: 12px; width: 56px; height: 56px; display: inline-flex; align-items: center; justify-content: center; opacity: .95; color: var(--green-strong); }
    .badge-icon svg { width: 56px; height: 56px; }

    .add-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    mat-form-field { flex: 1; }
    .list { margin-top: 8px; }
    .habit-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; }
    .habit-row .name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .row { display: flex; flex-wrap: wrap; gap: 8px; justify-content: space-between; align-items: center; margin-top: 12px; }
    .stat { font-weight: 700; }

    @media (max-width: 768px) {
      .habit-card { padding: 16px; }
      h2 { padding-left: 64px; min-height: 56px; }
      .add-row { flex-direction: column; align-items: stretch; }
      .row { gap: 10px; }
      button[mat-raised-button], button[mat-stroked-button] { width: 100%; }
    }
  `
})
export class HabitTrackerComponent {
  private readonly habitsKey = 'habits.list';
  private readonly todayKey = `habits.today.${new Date().toDateString()}`;

  habits: string[] = this.storage.get<string[]>(this.habitsKey, ['Sleep 7h', 'Move 30m', 'Vitamins']);
  completed: Record<string, boolean> = this.storage.get<Record<string, boolean>>(this.todayKey, {});
  newHabit = '';

  constructor(private storage: StorageService) {}

  get progress(): number {
    if (this.habits.length === 0) return 0;
    const done = this.habits.filter(h => !!this.completed[h]).length;
    return Math.round((done / this.habits.length) * 100);
  }

  addHabit(): void {
    const name = this.newHabit.trim();
    if (!name || this.habits.includes(name)) return;
    this.habits = [...this.habits, name];
    this.newHabit = '';
    this.persistHabits();
  }

  toggle(habit: string, selected: boolean): void {
    this.completed = { ...this.completed, [habit]: selected };
    this.persistToday();
  }

  resetToday(): void {
    this.completed = {};
    this.persistToday();
  }

  removeHabit(habit: string): void {
    this.habits = this.habits.filter(h => h !== habit);
    const { [habit]: _removed, ...rest } = this.completed;
    this.completed = rest;
    this.persistHabits();
    this.persistToday();
  }

  private persistHabits(): void {
    this.storage.set<string[]>(this.habitsKey, this.habits);
  }

  private persistToday(): void {
    this.storage.set<Record<string, boolean>>(this.todayKey, this.completed);
  }
}
