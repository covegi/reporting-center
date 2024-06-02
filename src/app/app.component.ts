import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, AsyncPipe, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  api = inject(ApiService);
  router = inject(Router);
  year = new Date().getFullYear();

  onSignOut() {
    this.api.auth.signout();
    this.router.navigateByUrl('/');
  }
}
