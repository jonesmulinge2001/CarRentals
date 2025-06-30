import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

interface Vehicle {
  id: string;
  name: string;
  title: string;
  description: string;
  pricePerHour: number;
  category: string;
  available: boolean;
  location: string;
  imageUrl: string;
}

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
  <div class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Manage Vehicles</h1>
      <button (click)="openModal()"
        class="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-sm rounded-md transition">
        + Add Vehicle
      </button>
    </div>

    <div *ngIf="isLoading" class="text-center py-8 text-gray-500 dark:text-gray-300">Loading vehicles...</div>
    <div *ngIf="error" class="text-red-500 text-center">{{ error }}</div>

    <div *ngIf="vehicles?.length; else noVehicles">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div *ngFor="let vehicle of vehicles"
          class="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden text-sm">
          <img [src]="vehicle.imageUrl" alt="{{ vehicle.name }}" class="w-full h-32 object-cover" />
          <div class="p-3 space-y-1">
            <h2 class="text-base font-semibold text-gray-800 dark:text-white">{{ vehicle.name }}</h2>
            <p class="text-xs text-gray-500 dark:text-gray-300">{{ vehicle.title }}</p>
            <p class="text-xs text-gray-600 dark:text-gray-400">{{ vehicle.description }}</p>
            <div class="text-xs text-gray-700 dark:text-gray-300 mt-1 space-y-0.5">
              <p><strong>Location:</strong> {{ vehicle.location }}</p>
              <p><strong>Price/Hour:</strong> Ksh {{ vehicle.pricePerHour }}</p>
              <p><strong>Category:</strong> {{ vehicle.category }}</p>
              <p><strong>Status:</strong>
                <span [class.text-green-500]="vehicle.available" [class.text-red-500]="!vehicle.available" class="font-medium">
                  {{ vehicle.available ? 'Available' : 'Unavailable' }}
                </span>
              </p>
            </div>
            <div class="flex justify-end gap-2 mt-2">
              <button (click)="openModal(vehicle)"
                class="px-2 py-0.5 bg-yellow-400 hover:bg-yellow-500 text-white text-xs rounded">
                Edit
              </button>
              <button (click)="deleteVehicle(vehicle.id)"
                class="px-2 py-0.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ng-template #noVehicles>
      <div class="text-center py-4 text-gray-500 dark:text-gray-300 text-sm">No vehicles found.</div>
    </ng-template>
  </div>

  <div *ngIf="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 w-full max-w-md p-5 rounded-lg shadow-md text-sm">
      <h2 class="text-lg font-bold mb-3 text-gray-900 dark:text-white">
        {{ editingId ? 'Edit Vehicle' : 'Add New Vehicle' }}
      </h2>
      <form [formGroup]="vehicleForm" (ngSubmit)="submitForm()" class="space-y-3">
        <input formControlName="name" type="text" placeholder="Name"
          class="w-full px-3 py-1.5 border rounded-md bg-white dark:bg-gray-700 dark:text-white text-sm" />
        <input formControlName="title" type="text" placeholder="Title"
          class="w-full px-3 py-1.5 border rounded-md bg-white dark:bg-gray-700 dark:text-white text-sm" />
        <textarea formControlName="description" placeholder="Description"
          class="w-full px-3 py-1.5 border rounded-md bg-white dark:bg-gray-700 dark:text-white text-sm"></textarea>
        <input formControlName="pricePerHour" type="number" placeholder="Price Per Hour"
          class="w-full px-3 py-1.5 border rounded-md bg-white dark:bg-gray-700 dark:text-white text-sm" />
        <input formControlName="category" type="text" placeholder="Category"
          class="w-full px-3 py-1.5 border rounded-md bg-white dark:bg-gray-700 dark:text-white text-sm" />
        <input formControlName="location" type="text" placeholder="Location"
          class="w-full px-3 py-1.5 border rounded-md bg-white dark:bg-gray-700 dark:text-white text-sm" />
        <input type="file" (change)="onImageSelected($event)" accept="image/*"
          class="w-full px-3 py-1.5 border rounded-md bg-white dark:bg-gray-700 dark:text-white text-sm" />
        <label class="flex items-center gap-2">
          <input type="checkbox" formControlName="available" class="form-checkbox text-blue-600" />
          <span class="text-gray-800 dark:text-white">Available</span>
        </label>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" (click)="closeModal()"
            class="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-500">
            Cancel
          </button>
          <button type="submit" [disabled]="vehicleForm.invalid || isSubmitting"
            class="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded">
            <span *ngIf="isSubmitting"
              class="animate-spin inline-block mr-1 border-2 border-t-white rounded-full w-3 h-3"></span>
            {{ editingId ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
  `,
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  isLoading = true;
  isSubmitting = false;
  error: string | null = null;
  showModal = false;
  selectedImageFile: File | null = null;
  vehicleForm!: FormGroup;
  editingId: string | null = null;

  private get token(): string {
    const storedToken = localStorage.getItem('token');
    return storedToken ? `Bearer ${storedToken}` : '';
  }

  constructor(private http: HttpClient, private fb: FormBuilder, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchVehicles();
  }

  initForm(): void {
    this.vehicleForm = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      pricePerHour: [null, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      location: ['', Validators.required],
      available: [true]
    });
  }

  fetchVehicles(): void {
    const headers = new HttpHeaders().set('Authorization', this.token);
    this.http.get<{ data: Vehicle[] }>('http://localhost:3000/admin/vehicle', { headers }).subscribe({
      next: (res) => {
        this.vehicles = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load vehicles.';
        this.toastr.error(this.error);
        this.isLoading = false;
      }
    });
  }

  openModal(vehicle?: Vehicle): void {
    this.showModal = true;
    this.editingId = vehicle?.id ?? null;
    this.vehicleForm.reset({
      name: vehicle?.name ?? '',
      title: vehicle?.title ?? '',
      description: vehicle?.description ?? '',
      pricePerHour: vehicle?.pricePerHour ?? '',
      category: vehicle?.category ?? '',
      location: vehicle?.location ?? '',
      available: vehicle?.available ?? true
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedImageFile = null;
    this.vehicleForm.reset();
    this.editingId = null;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedImageFile = input.files[0];
    }
  }

  submitForm(): void {
    if (this.vehicleForm.invalid) return;
    this.isSubmitting = true;
    const headers = new HttpHeaders().set('Authorization', this.token);

    if (this.editingId) {
      const patchHeaders = new HttpHeaders({
        Authorization: this.token,
        'Content-Type': 'application/json'
      });

      this.http.patch<{ data: Vehicle }>(
        `http://localhost:3000/admin/vehicle/${this.editingId}`,
        this.vehicleForm.value,
        { headers: patchHeaders }
      ).subscribe({
        next: (res) => {
          const index = this.vehicles.findIndex(v => v.id === res.data.id);
          if (index > -1) this.vehicles[index] = res.data;
          this.toastr.success('Vehicle updated successfully');
          this.closeModal();
        },
        error: () => this.toastr.error('Failed to update vehicle'),
        complete: () => (this.isSubmitting = false)
      });
    } else {
      const formData = new FormData();
      Object.entries(this.vehicleForm.value).forEach(([key, val]) => {
        formData.append(key, val as string);
      });
      if (this.selectedImageFile) {
        formData.append('image', this.selectedImageFile);
      }

      this.http.post<{ data: Vehicle }>('http://localhost:3000/admin/vehicle', formData, { headers }).subscribe({
        next: (res) => {
          this.vehicles.unshift(res.data);
          this.toastr.success('Vehicle created successfully');
          this.closeModal();
        },
        error: () => this.toastr.error('Failed to create vehicle'),
        complete: () => (this.isSubmitting = false)
      });
    }
  }

  deleteVehicle(id: string): void {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    const headers = new HttpHeaders().set('Authorization', this.token);
    this.http.delete(`http://localhost:3000/admin/vehicle/${id}`, { headers }).subscribe({
      next: () => {
        this.vehicles = this.vehicles.filter(v => v.id !== id);
        this.toastr.success('Vehicle deleted successfully');
      },
      error: () => this.toastr.error('Failed to delete vehicle')
    });
  }
}