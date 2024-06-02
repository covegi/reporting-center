import { Routes } from '@angular/router';

// import { canActivate, hasCustomClaim } from '@angular/fire/auth-guard';

import { UsersComponent } from './users/users.component';
import { UserComponent } from './user/user.component';
import { ReportsComponent } from './reports/reports.component';
import { ReportComponent } from './report/report.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { HomeComponent } from './home/home.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { OrganizationComponent } from './organization/organization.component';

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
    // ...canActivate(() => hasCustomClaim('isAdmin')),
  },
  {
    path: 'reports',
    component: ReportsComponent,
  },
  {
    path: 'reports/:id',
    component: ReportComponent,
  },
  {
    path: 'organizations',
    component: OrganizationsComponent,
  },
  {
    path: 'organizations/:id',
    component: OrganizationComponent,
  },
];

function canActivate(arg0: () => any): import('@angular/router').Route {
  throw new Error('Function not implemented.');
}

function hasCustomClaim(arg0: string): any {
  throw new Error('Function not implemented.');
}
// function canActivate(arg0: () => any): import('@angular/router').Route {
//   throw new Error('Function not implemented.');
// }

// function hasCustomClaim(arg0: string): any {
//   throw new Error('Function not implemented.');
// }
