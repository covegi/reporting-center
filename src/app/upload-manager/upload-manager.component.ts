import { Component, inject } from '@angular/core';
import { DropzoneDirective } from '../directives/dropzone.directive';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-upload-manager',
  standalone: true,
  imports: [DropzoneDirective, CommonModule],
  templateUrl: './upload-manager.component.html',
  styleUrl: './upload-manager.component.css',
})
export class UploadManagerComponent {
  #api = inject(ApiService);
  #activatedRoute = inject(ActivatedRoute);

  private reportId = this.#activatedRoute.snapshot.params['id'];
  isHovering: boolean = false;

  constructor() {}

  toggleHover(event: boolean) {
    this.isHovering = event;
    console.log(event);
  }

  onDrop(files: FileList) {
    this.#api.upload(files, this.reportId);
  }
}
