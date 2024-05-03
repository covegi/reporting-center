import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

// import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
// import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink, AsyncPipe, JsonPipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  // constructor(private db: DbService) {}
  $users = collectionData(collection(inject(Firestore), 'users'), {
    idField: 'id',
  });
  // $users = collectionData(collection(this.db.firestore, "users"), { idField: "id"});
}
