import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  template: `
  <div class="landing-container">
    <h1 class="landing-title">Welcome to Our Landing Page</h1>

    <div class="button-group">
      <button [routerLink]="['']" class="btn primary-btn">Home</button>
      <button [routerLink]="['post']" class="btn secondary-btn">Posts</button>
    </div>
  </div>`,
  styles: ``
})
export class HomeComponent {}