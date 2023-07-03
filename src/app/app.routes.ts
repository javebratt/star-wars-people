import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'people',
    pathMatch: 'full',
  },
  {
    path: 'people',
    loadComponent: () =>
      import('./people/people.page').then((m) => m.PeoplePage),
  },
];
