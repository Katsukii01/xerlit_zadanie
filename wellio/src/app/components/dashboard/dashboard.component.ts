import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
// removed progress bars in favor of circular charts
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, RouterLink],
  template: `
    <section class="intro card" aria-label="Wellio introduction">
      <h1>Your calm daily rhythm</h1>
      <p>Wellio helps you build small, consistent habits that add up: hydration, short screen breaks, simple habit tracking and mindful mood reflection. A lightweight app with clear summaries and gentle nudges for real progress.</p>
    </section>

    <div class="grid grid-2x2">
      <a routerLink="/water"><mat-card class="card feature feature-water">
        <div class="badge-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2S5 10 5 14.5A6.5 6.5 0 0011.5 21 6.5 6.5 0 0018 14.5C18 10 12 2 12 2z"/></svg>
        </div>
        <div class="feature-head">
          <h3>Water</h3>
        </div>
        <div class="circle">
          <svg viewBox="0 0 120 120">
            <circle class="bg" cx="60" cy="60" r="52"/>
            <circle class="fg" cx="60" cy="60" r="52"
              [attr.stroke-dasharray]="circumference"
              [attr.stroke-dashoffset]="dashOffset(animatedWaterPercent)"></circle>
            <text x="60" y="66" text-anchor="middle">{{ animatedWaterPercent }}%</text>
          </svg>
        </div>
      </mat-card></a>
      <a routerLink="/habits"><mat-card class="card feature feature-habits">
        <div class="badge-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z"/></svg>
        </div>
        <div class="feature-head">
          <h3>Habits</h3>
        </div>
        <div class="circle">
          <svg viewBox="0 0 120 120">
            <circle class="bg" cx="60" cy="60" r="52"/>
            <circle class="fg" cx="60" cy="60" r="52"
              [attr.stroke-dasharray]="circumference"
              [attr.stroke-dashoffset]="dashOffset(animatedHabitsPercent)"></circle>
            <text x="60" y="66" text-anchor="middle">{{ animatedHabitsPercent }}%</text>
          </svg>
        </div>
      </mat-card></a>
      <a routerLink="/mood"><mat-card class="card feature feature-mood">
        <div class="badge-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm-3.5 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm7 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM7 15h10a5 5 0 00-10 0z"/></svg>
        </div>
        <div class="feature-head">
          <h3>Mood</h3>
        </div>
        <div class="emoji" aria-hidden="true">{{ avgMoodEmoji }}</div>
      </mat-card></a>
      <a routerLink="/breaks"><mat-card class="card feature feature-breaks">
        <div class="badge-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 20a8 8 0 110-16 8 8 0 010 16zm1-13v5l4 2"/></svg>
        </div>
        <div class="feature-head">
          <h3>Breaks</h3>
        </div>
        <div class="stat-big">{{ breaksToday }}</div>
      </mat-card></a>
    </div>
  `,
  styles: `
    .intro { background: black; color: #fff; border-radius: 18px; padding: 24px; animation: fadeInUp .35s ease-out both; box-shadow: 0 14px 40px rgba(255, 255, 233, 0.35); }
    .intro h1 { margin: 0 0 8px; font-weight: 900; letter-spacing: .2px; color: #ffffff; }
    .intro p { margin: 0; color: #f0fbff; line-height: 1.65; }
    .intro-cta { display: flex; gap: 10px; }

    .grid { display: grid; gap: 16px; margin-top: 16px; }
    .grid-2x2 { grid-template-columns: repeat(2, 1fr); }
    a { text-decoration: none; }
    .feature { padding: 12px; transition: transform .2s ease, box-shadow .2s ease, outline-color .2s ease; position: relative; overflow: hidden; border: 0; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 295px; text-align: center; border-radius: 18px; box-shadow: 0 18px 50px rgba(2, 6, 23, 0.25); outline: 8px solid transparent; outline-offset: 4px; }
    .feature::before { content: ''; position: absolute; inset: -30% -10% auto -10%; height: 65%; background: radial-gradient(60% 60% at 50% 40%, rgba(255,255,255,.28), rgba(255,255,255,0)); filter: blur(12px); pointer-events: none; }
    .badge-icon { position: absolute; top: 16px; left: 16px; width: 72px; height: 72px; display: inline-flex; align-items: center; justify-content: center; color: #fff; opacity: .95; }
    .badge-icon svg { width: 72px; height: 72px; }
    .feature-head { display: flex; align-items: center; justify-content: center; margin: 16px 0 12px; gap: 12px; width: 100%; }
    .metric { font-weight: 800; color: #ffffff; }
    .feature-water { background: linear-gradient(135deg, #1e88e5 0%, #64b5f6 100%); }
    .feature-habits { background: linear-gradient(135deg, var(--green-strong) 0%, #66bb6a 100%); }
    .feature-mood { background: linear-gradient(135deg, #7b1fa2 0%, #ba68c8 100%); }
    .feature-breaks { background: linear-gradient(135deg, var(--torii-red) 0%, #ef6c00 100%); }
    .feature:hover { transform: translateY(-4px) scale(1.03); box-shadow: 0 26px 60px rgba(2, 6, 23, 0.28); }
    .feature-water:hover { outline-color:rgb(101, 206, 255); box-shadow: 0 26px 60px rgba(2, 6, 23, 0.28), 0 0 0 6px rgba(179,229,252,.35), 0 0 28px rgba(179,229,252,.5); }
    .feature-habits:hover { outline-color:rgb(86, 248, 132); box-shadow: 0 26px 60px rgba(2, 6, 23, 0.28), 0 0 0 6px rgba(185,246,202,.35), 0 0 28px rgba(185,246,202,.5); }
    .feature-mood:hover { outline-color:rgb(230, 96, 253); box-shadow: 0 26px 60px rgba(2, 6, 23, 0.28), 0 0 0 6px rgba(225,190,231,.35), 0 0 28px rgba(225,190,231,.5); }
    .feature-breaks:hover { outline-color:rgb(247, 138, 104); box-shadow: 0 26px 60px rgba(2, 6, 23, 0.28), 0 0 0 6px rgba(255,204,188,.35), 0 0 28px rgba(255,204,188,.5); }
    .feature:hover .circle svg, .feature:hover .emoji, .feature:hover .stat-big, .feature:hover .feature-head h3 { transform: scale(1.10); transition: transform .2s ease; }
    h3 { margin: 0; font-weight: 800; font-size: 24px; }
    p { margin: 6px 0 0; opacity: .95; font-size: 16px; }

    /* circular charts */
    .circle { display: grid; place-items: center; margin: 8px 0; }
    .circle svg { width: 128px; height: 128px; }
    .circle .bg { fill: none; stroke: rgba(255,255,255,.3); stroke-width: 11; }
    .circle .fg { fill: none; stroke: #ffffff; stroke-linecap: round; stroke-width: 11; transform: rotate(-90deg); transform-origin: 50% 50%; transition: stroke-dashoffset .5s ease; }
    .circle text { font-weight: 900; fill: #ffffff; font-size: 22px; }

    .emoji { font-size: 80px; height: 128px; line-height: 128px; display: grid; place-items: center; }
    .stat-big { font-weight: 900; font-size: 52px; height: 128px; display: grid; place-items: center; }

    @media (max-width: 900px) {
      .intro { padding: 16px; }
      .grid-2x2 { grid-template-columns: 1fr; }
    }
  `
})
export class DashboardComponent implements OnInit {
  waterMl = 0;
  waterGoal = 2000;
  get waterPercent(): number { return Math.min(100, Math.round((this.waterMl / this.waterGoal) * 100)); }
  animatedWaterPercent = 0;

  habitsCount = 0;
  habitsDone = 0;
  get habitsPercent(): number { return this.habitsCount ? Math.round((this.habitsDone / this.habitsCount) * 100) : 0; }
  animatedHabitsPercent = 0;

  moodEntries = 0;
  breaksCompleted = 0;
  breaksToday = 0;
  avgMoodEmoji = '😐';

  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    // Water
    this.waterMl = this.storage.get<number>('water.today.ml', 0);

    // Habits
    const habits = this.storage.get<string[]>('habits.list', ['Sleep 7h', 'Move 30m', 'Vitamins']);
    const todayKey = `habits.today.${new Date().toDateString()}`;
    const completed = this.storage.get<Record<string, boolean>>(todayKey, {});
    this.habitsCount = habits.length;
    this.habitsDone = habits.filter(h => !!completed[h]).length;

    // Mood
    const mood = this.storage.get<{ date: string; mood: string }[]>('mood.history', []);
    this.moodEntries = mood.length;
    if (mood.length) {
      const map: Record<string, number> = { '😊': 3, '😐': 2, '😞': 1 };
      const avg = Math.round(mood.slice(0, 7).reduce((s, m) => s + (map[m.mood] || 2), 0) / Math.min(7, mood.length));
      this.avgMoodEmoji = avg >= 3 ? '😊' : avg <= 1 ? '😞' : '😐';
    }

    // Breaks (optional)
    this.breaksCompleted = this.storage.get<number>('breaks.completed', 0);
    this.breaksToday = this.storage.get<number>(`breaks.today.${new Date().toDateString()}`, this.breaksCompleted);

    // animate counters
    this.animateTo('animatedWaterPercent', this.waterPercent);
    this.animateTo('animatedHabitsPercent', this.habitsPercent);
  }

  readonly circumference = 2 * Math.PI * 52;
  dashOffset(percent: number): number {
    return this.circumference * (1 - percent / 100);
  }

  private animateTo(prop: 'animatedWaterPercent' | 'animatedHabitsPercent', target: number): void {
    const start = this[prop];
    const delta = target - start;
    const duration = 450;
    const startTs = performance.now();
    const step = (ts: number) => {
      const t = Math.min(1, (ts - startTs) / duration);
      this[prop] = Math.round(start + delta * t);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}
