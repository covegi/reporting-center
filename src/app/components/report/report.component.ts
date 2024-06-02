import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { ApiService } from '../../services/api.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './report.component.html',
})
export class ReportComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private reportId = this.activatedRoute.snapshot.params['id'];

  api = inject(ApiService);
  report = toSignal(this.api.reports.get(this.reportId));
  isDragover = false;

  form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    todos: new FormArray(
      [
        new FormGroup({
          completed: new FormControl(false, { nonNullable: true }),
          description: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required],
          }),
        }),
      ],
      { validators: [Validators.required] },
    ),
  });

  addTodo = () => {
    this.form.controls.todos.push(
      new FormGroup({
        completed: new FormControl(false, { nonNullable: true }),
        description: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
    );
  };

  removeTodo = (index: number) => {
    this.form.controls.todos.removeAt(index);
  };

  constructor() {
    // Populates the form with the values stored in database
    effect(() => {
      if (this.report()) {
        // Adds form fields for todos based on values in backend
        // TODO: This adds an empty todo. Problem is here somewhere
        this.report()!.todos.forEach(this.addTodo);
        // Set form values based on values in backend
        this.form.patchValue(this.report()!);
      }
    });
  }

  onSubmit() {
    this.api.reports
      .update(this.reportId, this.form.value)
      // Navigate to /reports after update
      .then(() => this.router.navigate(['reports']))
      .catch(console.error);
  }

  onDelete() {
    this.api.users
      .delete(this.reportId)
      // Navigate to /reports after update
      .then(() => this.router.navigate(['reports']))
      .catch(console.error);
  }

  onUploadFile(event: Event) {
    const input = event.target as HTMLInputElement;
    this.api.reports.createFile(this.reportId, input.files!.item(0)!);
  }

  onDeleteFile() {
    this.api.reports.deleteFile(this.reportId);
  }
}
