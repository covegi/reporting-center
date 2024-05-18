import { Routes } from '@angular/router';

import { canActivate, hasCustomClaim } from '@angular/fire/auth-guard';

import { UsersComponent } from './components/users/users.component';
import { UserComponent } from './components/user/user.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ReportComponent } from './components/report/report.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
    // ...canActivate(() => hasCustomClaim('isAdmin')),
  },
  {
    path: 'users/:id',
    component: UserComponent,
    ...canActivate(() => hasCustomClaim('isAdmin')),
  },
  {
    path: 'reports',
    component: ReportsComponent,
  },
  {
    path: 'reports/:id',
    component: ReportComponent,
  },
];
