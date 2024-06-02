import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink, AsyncPipe, JsonPipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  #api = inject(ApiService);
  #router = inject(Router);

  $users = collectionData(collection(inject(Firestore), 'users'), {
    idField: 'id',
  });

  addUser() {
    const date = new Date().toISOString().split('T')[0];
    console.log(date);
    this.#api.users.create(date).then((docRef) => {
      const newUserId = docRef.id;
      this.#router.navigate(['users', newUserId]);
    });
  }
}
