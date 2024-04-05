import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './user/user.component';
import { ReportsComponent } from './reports/reports.component';
import { ReportComponent } from './report/report.component';

export const routes: Routes = [
    {
        path: "users",
        component: UsersComponent
    },
    {
        path: "users/:id",
        component: UserComponent
    },
    {
        path: "reports",
        component: ReportsComponent
    },
    {
        path: "reports/:id",
        component: ReportComponent
    }
];
