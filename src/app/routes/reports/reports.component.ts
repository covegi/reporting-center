import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { ApiService } from '../../services/api.service';
import { Report } from '../../interfaces/report.interface';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './reports.component.html',
})
export class ReportsComponent {
  private api = inject(ApiService);
  private router = inject(Router);

  reports = this.api.reports.getAll();

  getTodos(report: Report) {
    return {
      total: report.todos.length,
      resolved: report.todos.filter((todo) => todo.completed).length,
    };
  }

  onCreate() {
    this.api.reports
      .create()
      .then((id) => this.router.navigate(['reports', id]))
      .catch(console.error);
  }
}
