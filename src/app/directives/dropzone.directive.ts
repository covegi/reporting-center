import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDropzone]',
  standalone: true,
})
export class DropzoneDirective {
  constructor() {}

  @Output() dropped = new EventEmitter<FileList>();
  @Output() hovered = new EventEmitter<boolean>();

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      this.dropped.emit(files);
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver($event: { preventDefault: () => void }) {
    $event.preventDefault();
    this.hovered.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave($event: {
    preventDefault: () => void;
    hovered: { emit: (arg0: boolean) => void };
  }) {
    $event.preventDefault();
    this.hovered.emit(false);
  }
}
