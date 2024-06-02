import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { ApiService } from '../services/api.service';
import { of, Subscription } from 'rxjs';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [RouterLink, AsyncPipe, CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private subscription: Subscription | undefined;
  totalCount: number[] = [];
  incompleteCount: number[] = [];

  $reports = collectionData(collection(inject(Firestore), 'reports'), {
    idField: 'id',
  });

  ngOnInit(): void {
    const fragment = this.activatedRoute.snapshot.fragment;
    if (fragment) {
      this.$reports = this.api.reports.getSelected(fragment);
      this.subscription = this.$reports.subscribe(
        (reports) => {
          this.$reports = of(reports);
        },
        (error) => {
          console.error('Error fetching reports:', error);
        },
      );
    }

    this.$reports.forEach((doc) => {
      doc.forEach((report) => {
        let incompleted: number = 0;
        let total: number = 0;
        report['todos'].forEach((todo: any) => {
          total++;
          if (!todo.completed) {
            incompleted++;
          }
        });
        this.incompleteCount.push(incompleted);
        this.totalCount.push(total);
      });
    });
  }

  addReport() {
    const date = new Date().toISOString().split('T')[0];
    this.api.reports.create(date).then((docRef) => {
      const newReportId = docRef.id;
      this.router.navigate(['reports', newReportId]);
    });
  }
}
