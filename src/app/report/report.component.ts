import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from '@angular/forms';

import { ApiService } from '../services/api.service';
import { UploadManagerComponent } from '../upload-manager/upload-manager.component';

@Component({
  selector: 'app-report',
  standalone: true,
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
  imports: [ReactiveFormsModule, UploadManagerComponent],
})
export class ReportComponent {
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  private reportId = this.activatedRoute.snapshot.params['id'];

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
    this.api.reports
      .get(this.reportId)
      .then((report) => {
        // Adds form fields for todos based on values in backend
        report.todos.forEach(this.addTodo);
        // Set form values based on values in backend
        this.form.patchValue(report);
      })
      .catch(console.error);
  }

  onSubmit() {
    this.api.reports
      .update(this.reportId, this.form.value)
      // Navigate to /reports after update
      .then(() => this.router.navigate(['reports']))
      .catch(console.error);
  }

  onDelete() {
    this.api.reports
      .delete(this.reportId)
      // Navigate to /reports after update
      .then(() => this.router.navigate(['reports']))
      .catch(console.error);
  }
}
