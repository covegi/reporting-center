import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

import { debounceTime } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private userId = this.activatedRoute.snapshot.params['id'];

  form = new FormGroup({
    role: new FormControl(),
    email: new FormControl(),
    name: new FormControl()
  })

  constructor() {
    // Persist updates to backend
    this.form.valueChanges
      .pipe(debounceTime(200))
      .subscribe(this.api.users.update(this.userId));

    // Populates the form with the values stored in database
    firstValueFrom(this.api.users.get(this.userId))
      .then((user) => this.form.patchValue(user!))
  }
}
