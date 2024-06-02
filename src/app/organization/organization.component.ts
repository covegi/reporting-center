import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.css',
})
export class OrganizationComponent implements OnInit {
  private api = inject(ApiService);
  private activatedRoute = inject(ActivatedRoute);
  private organizationId = this.activatedRoute.snapshot.params['id'];
  private router = inject(Router);

  form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    const fragment: string | null = this.activatedRoute.snapshot.fragment;
    if (fragment) {
      this.form.patchValue({
        name: fragment,
      });
    }
  }

  onSubmit() {
    this.api.organizations
      .update(this.organizationId, this.form.value)
      // Navigate to /organizations after update
      .then(() => this.router.navigate(['organizations']))
      .catch(console.error);
  }

  onDelete() {
    this.api.organizations
      .delete(this.organizationId)
      .then(() => this.router.navigate(['organizations']))
      .catch(console.error);
  }

  onBack() {
    this.router.navigate(['organizations']);
  }
}
