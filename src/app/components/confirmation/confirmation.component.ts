import { Component, ElementRef, input, output, viewChild } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [],
  templateUrl: './confirmation.component.html',
})
export class ConfirmationComponent {
  confirm = output<boolean>();
  text = input('');

  private dialogElement =
    viewChild<ElementRef<HTMLDialogElement>>('dialogElement');

  onOpen() {
    this.dialogElement()?.nativeElement.showModal();
  }

  onConfirm() {
    this.confirm.emit(true);
    this.dialogElement()?.nativeElement.close();
  }

  onReject() {
    this.confirm.emit(false);
    this.dialogElement()?.nativeElement.close();
  }
}
