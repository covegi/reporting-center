import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user.component.html',
})
export class UserComponent {
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  private userId = this.activatedRoute.snapshot.params['id'];
  private user = toSignal(this.api.users.get(this.userId));

  form = new FormGroup({
    admin: new FormControl<boolean>(false, {
      nonNullable: true,
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email],
    }),
  });

  constructor() {
    // Populates the form with the values stored in database
    effect(() => this.form.patchValue(this.user()!));
  }

  onSubmit() {
    this.api.users
      .update(this.userId, this.form.value)
      // Navigate to /users after update
      .then(() => this.router.navigate(['users']))
      .catch(console.error);
  }

  onDelete() {
    this.api.users
      .delete(this.userId)
      // Navigate to /users after update
      .then(() => this.router.navigate(['users']))
      .catch(console.error);
  }
}
