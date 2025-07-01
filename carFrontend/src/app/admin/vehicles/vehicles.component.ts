import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

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
  fuelCapacity?: string;
  transmission?: string;
  seatingCapacity?: string;
}

@Component({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  isLoading = true;
  isSubmitting = false;
  error: string | null = null;
  showModal = false;
  showDeleteModal = false;
  vehicleForm!: FormGroup;
  selectedImageFile: File | null = null;
  editingId: string | null = null;
  vehicleToDelete: Vehicle | null = null;
  searchTerm = '';

  constructor(private http: HttpClient, private fb: FormBuilder, private toastr: ToastrService) {}

  private get token(): string {
    const storedToken = localStorage.getItem('token');
    return storedToken ? `Bearer ${storedToken}` : '';
  }

  ngOnInit(): void {
    this.initForm();
    this.fetchVehicles();
  }

  get filteredVehicles(): Vehicle[] {
    const term = this.searchTerm.toLowerCase();
    return this.vehicles.filter(vehicle =>
      vehicle.name.toLowerCase().includes(term) ||
      vehicle.title.toLowerCase().includes(term) ||
      vehicle.category.toLowerCase().includes(term) ||
      vehicle.location.toLowerCase().includes(term)
    );
  }

  initForm(): void {
    this.vehicleForm = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      pricePerHour: [null, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      location: ['', Validators.required],
      fuelCapacity: [''],
      transmission: [''],
      seatingCapacity: [''],
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
      fuelCapacity: vehicle?.fuelCapacity ?? '',
      transmission: vehicle?.transmission ?? '',
      seatingCapacity: vehicle?.seatingCapacity ?? '',
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

    const formValue = { ...this.vehicleForm.value };

    // ✅ Handle optional numeric fields carefully
    formValue.pricePerHour = parseFloat(formValue.pricePerHour);

    if (formValue.fuelCapacity) {
      formValue.fuelCapacity = parseFloat(formValue.fuelCapacity);
    } else {
      delete formValue.fuelCapacity;
    }

    if (formValue.seatingCapacity) {
      formValue.seatingCapacity = parseInt(formValue.seatingCapacity, 10);
    } else {
      delete formValue.seatingCapacity;
    }

    if (this.editingId) {
      // ✅ PATCH request for update
      this.http.patch<{ data: Vehicle }>(
        `http://localhost:3000/admin/vehicle/${this.editingId}`,
        formValue,
        { headers: headers.set('Content-Type', 'application/json') }
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
      // ✅ POST request for create
      const formData = new FormData();
      Object.entries(formValue).forEach(([key, val]) => {
        formData.append(key, String(val));
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

  confirmDelete(vehicle: Vehicle): void {
    this.vehicleToDelete = vehicle;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.vehicleToDelete = null;
  }

  deleteVehicle(): void {
    if (!this.vehicleToDelete) return;
    const id = this.vehicleToDelete.id;
    const headers = new HttpHeaders().set('Authorization', this.token);
    this.http.delete(`http://localhost:3000/admin/vehicle/${id}`, { headers }).subscribe({
      next: () => {
        this.vehicles = this.vehicles.filter(v => v.id !== id);
        this.toastr.success('Vehicle deleted successfully');
        this.cancelDelete();
      },
      error: () => this.toastr.error('Failed to delete vehicle')
    });
  }
}
