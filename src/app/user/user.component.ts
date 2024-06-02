import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

import { ApiService } from '../services/api.service';
import { UserRole } from '../interfaces/user.interface';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  $organizations = this.api.organizations.getAll();

  private userId = this.activatedRoute.snapshot.params['id'];

  form = new FormGroup({
    role: new FormControl<UserRole>('user', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email],
    }),
    organization: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    name: new FormControl('', {
      nonNullable: true,
    }),
  });

  constructor() {
    // Populates the form with the values stored in database
    this.api.users
      .get(this.userId)
      .then((user) => this.form.patchValue(user))
      .catch(console.error);
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

  onBack() {
    this.router.navigate(['users']);
  }
}
