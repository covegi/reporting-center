import { Component, ViewContainerRef, effect, inject } from '@angular/core';
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
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ConfirmationService } from '../../components/confirmation/confirmation.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, AsyncPipe],
  templateUrl: './report.component.html',
})
export class ReportComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private reportId = this.activatedRoute.snapshot.params['id'];
  private viewContainerRef = inject(ViewContainerRef);
  private confirmationService = inject(ConfirmationService);

  api = inject(ApiService);
  report = toSignal(this.api.reports.get(this.reportId));
  users = toSignal(this.api.users.getAll());

  isDragover = false;

  form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    project: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    contractor: new FormControl('', {
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
    users: new FormControl<Array<string>>([], {
      nonNullable: true,
      validators: [Validators.required],
    }),
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

  getUserSelected(userId: string) {
    this.form.controls.users.value.includes(userId);
  }

  constructor() {
    // Populates the form with the values stored in database
    effect(() => {
      if (this.report()) {
        // Adds form fields for todos based on values in backend
        this.form.controls.todos.removeAt(0);
        const todos = this.report()!.todos;
        if (todos?.length) this.report()!.todos.forEach(this.addTodo);
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

  async onDelete() {
    const hasConfirmed = await this.confirmationService.askForConfirmation(
      this.viewContainerRef,
      'Vill du verkligen ta bort den här rapporten?',
    );
    if (hasConfirmed)
      this.api.reports
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
