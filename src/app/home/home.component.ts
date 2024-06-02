import {
  Component,
  inject,
  Renderer2,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('image') image!: ElementRef;
  renderer = inject(Renderer2);

  ngAfterViewInit() {
    const img = new Image();
    img.src = 'assets/images/background.jpg';

    img.onload = () => {
      if (this.image) {
        this.renderer.setStyle(this.image.nativeElement, 'src', img.src);
      }
    };
  }
}
