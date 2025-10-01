import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'water',
    loadComponent: () =>
      import('./components/water-tracker/water-tracker.component').then(
        (m) => m.WaterTrackerComponent
      ),
  },
  {
    path: 'habits',
    loadComponent: () =>
      import('./components/habit-tracker/habit-tracker.component').then(
        (m) => m.HabitTrackerComponent
      ),
  },
  {
    path: 'mood',
    loadComponent: () =>
      import('./components/mood-tracker/mood-tracker.component').then(
        (m) => m.MoodTrackerComponent
      ),
  },
  {
    path: 'breaks',
    loadComponent: () =>
      import('./components/office-breaks/office-breaks.component').then(
        (m) => m.OfficeBreaksComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
