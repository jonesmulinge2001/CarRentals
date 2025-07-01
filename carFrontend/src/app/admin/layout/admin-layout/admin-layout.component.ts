// src/app/admin/layout/admin-layout.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule, SidebarComponent],
  template: `
    <div class="flex min-h-screen bg-gray-100">
      <app-sidebar></app-sidebar>
      <main class="flex-1 p-4 overflow-y-auto h-screen">
  <router-outlet></router-outlet>
</main>

    </div>
  `
})
export class AdminLayoutComponent {}
