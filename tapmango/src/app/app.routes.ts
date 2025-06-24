import { Routes } from '@angular/router';
import { ChartsComponent } from './components/charts/charts.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'charts',
  },

  {
    path: 'charts',
    component: ChartsComponent,
  },
];
