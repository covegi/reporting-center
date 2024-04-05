import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';

import { DocumentData, DocumentReference, Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';

export interface Report {
  id: string;
  name: string;
  description: string;
  todos: Array<Todo>;
}

export interface Todo {
  description: string;
  completed: boolean;
}

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent {
  private activatedRoute = inject(ActivatedRoute);
  private firestore = inject(Firestore);

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
    const documentRef = doc(this.firestore, "reports", this.activatedRoute.snapshot.params['id']);

    // Ensures that form is updated when backend updates
    firstValueFrom(docData(documentRef))
      .then((report) => {
        report!['todos'].forEach(() => this.addTodo());
        this.form.patchValue(report!);
      })
      .then(() =>
        // Persists updates to backend
        this.form.valueChanges.pipe(
          debounceTime(200)
        ).subscribe((report) => {
          console.table(report.todos)
          updateDoc(documentRef, report)
      })
    )
  }
}
