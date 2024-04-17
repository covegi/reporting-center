import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';

import { DocumentData, DocumentReference, Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent {
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private reportId = this.activatedRoute.snapshot.params['id'];

  form = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
    todos: new FormArray([
      new FormGroup({
        completed: new FormControl(),
        description: new FormControl(),
      })
    ])
  });

  addTodo() {
    this.form.controls.todos.push(
      new FormGroup({
        completed: new FormControl(),
        description: new FormControl(),
      })
    )
  }

  removeTodo(index: number) {
    this.form.controls.todos.removeAt(index);
  }

  constructor() {
    // Ensures that form is updated when backend updates
    firstValueFrom(this.api.reports.get(this.reportId))
      .then((report) => {
        // Adds form fields for todos based on values in backend
        report!['todos'].forEach(() => this.addTodo());
        // Set form values based on value in backend
        this.form.patchValue(report!);
        // Persist updates to backend
        this.form.valueChanges
          .pipe(debounceTime(200))
          .subscribe(this.api.reports.update(this.reportId));
      });
  }
}
