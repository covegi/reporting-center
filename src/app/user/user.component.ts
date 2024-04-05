import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';
import { debounceTime } from 'rxjs/operators';

export interface User {
  id: string;
  role: "admin" | "super-user" | "user";
  email: string;
  name: string;
  reports: Array<string>;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  private activatedRoute = inject(ActivatedRoute);
  private firestore = inject(Firestore);

  form = new FormGroup({
    role: new FormControl(),
    email: new FormControl(),
    name: new FormControl(),
  });

  // API Service

  // api.users.get("id")
  // api.users.getAll()
  // api.users.update("id", { ... })
  // api.users.delete("id")

  // api.reports.get("id")
  // api.reports.getAll()
  // api.reports.update("id", { ... })
  // api.reports.delete("id")

  constructor() {
    const documentRef = doc(this.firestore, "users", this.activatedRoute.snapshot.params['id']);

    // Persists updates to backend
    this.form.valueChanges.pipe(
      debounceTime(200)
    ).subscribe((user) => updateDoc(documentRef, user));

    // Ensures that form is updated when backend updates
    docData(documentRef).subscribe((user) => this.form.patchValue(user!));
  }
}
