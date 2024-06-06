import { Injectable, ViewContainerRef } from '@angular/core';
import { ConfirmationComponent } from './confirmation.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  askForConfirmation(viewContainerRef: ViewContainerRef, question: string) {
    return new Promise<boolean>((resolve) => {
      const componentRef = viewContainerRef.createComponent(
        ConfirmationComponent,
      );
      componentRef.setInput('text', question);
      componentRef.instance.onOpen();
      componentRef.instance.confirm.subscribe((confirm) => {
        resolve(confirm);
        componentRef.destroy();
      });
    });
  }
}
