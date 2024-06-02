import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ReportsComponent } from '../reports/reports.component';
import { OrganizationComponent } from '../organization/organization.component';

@Component({
  selector: 'app-organizations',
  standalone: true,
  templateUrl: './organizations.component.html',
  styleUrl: './organizations.component.css',
  imports: [
    RouterLink,
    AsyncPipe,
    CommonModule,
    ReportsComponent,
    OrganizationComponent,
  ],
})
export class OrganizationsComponent {
  private firestore = inject(Firestore);
  private api = inject(ApiService);
  private router = inject(Router);

  $organizations = collectionData(
    collection(inject(Firestore), 'organizations'),
    { idField: 'id' },
  );

  addOrg() {
    const date = new Date().toISOString().split('T')[0];
    this.api.organizations.create(date).then((docRef) => {
      const newOrgId = docRef.id;
      this.api.organizations.update(newOrgId, { name: 'Enter Organization' });
      this.router.navigate(['organizations', newOrgId]);
    });
  }

  getSelectedOrganization(org: string) {
    this.router.navigate(['reports'], { fragment: org });
  }
}
