import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Firestore, collection, collectionData } from '@angular/fire/firestore';
// import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  // constructor(private db: DbService) {}
  $reports = collectionData(collection(inject(Firestore), "reports"), { idField: "id"});
  // $reports = collectionData(collection(this.db.firestore, "reports"), { idField: "id" });
  
  }
