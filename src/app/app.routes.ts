import { Routes } from '@angular/router';

import {
  canActivate,
  hasCustomClaim,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

import { UsersComponent } from './routes/users/users.component';
import { UserComponent } from './routes/user/user.component';
import { ReportsComponent } from './routes/reports/reports.component';
import { ReportComponent } from './routes/report/report.component';
import { SignupComponent } from './routes/signup/signup.component';
import { SigninComponent } from './routes/signin/signin.component';
import { HomeComponent } from './routes/home/home.component';

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
    ...canActivate(() => redirectUnauthorizedTo('')),
  },
  {
    path: 'users/:id',
    component: UserComponent,
    // ...canActivate(() => hasCustomClaim('isAdmin')),
    ...canActivate(() => redirectUnauthorizedTo('')),
  },
  {
    path: 'reports',
    component: ReportsComponent,
    ...canActivate(() => redirectUnauthorizedTo('')),
  },
  {
    path: 'reports/:id',
    component: ReportComponent,
    ...canActivate(() => redirectUnauthorizedTo('')),
  },
];
