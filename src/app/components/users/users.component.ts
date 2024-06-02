import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink, AsyncPipe, JsonPipe],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  private api = inject(ApiService);
  private router = inject(Router);

  users = this.api.users.getAll();

  onCreate() {
    this.api.users
      .create()
      .then((id) => this.router.navigate(['users', id]))
      .catch(console.error);
  }
}
