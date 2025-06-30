import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-between"
    >
      <div>
        <h3 class="text-gray-700 dark:text-gray-300 text-sm mb-1">{{ title }}</h3>
        <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ value }}</p>
      </div>
      <span class="material-icons text-gray-400 dark:text-gray-300 text-4xl">{{ icon }}</span>
    </div>
  `,
})
export class CardComponent {
  @Input() title!: string;
  @Input() value!: string | number;
  @Input() icon!: string; 
}
