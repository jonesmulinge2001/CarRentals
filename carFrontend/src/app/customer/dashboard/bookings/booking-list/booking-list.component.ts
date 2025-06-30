import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

interface Vehicle {
  title: string;
  location: string;
  imageUrl: string;
  pricePerHour: number;
  category?: string;
}

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

interface Booking {
  id: string;
  startdate: string;
  enddate: string;
  status: BookingStatus;
  totalPrice: number;
  vehicle: Vehicle;
}

@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  selector: 'app-bookings-list',
  templateUrl: './booking-list.component.html'
})
export class BookingsListComponent implements OnInit {
  bookings: Booking[] = [];
  loading = false;
  selectedBooking: Booking | null = null;
  reviewText: string = '';
  private reviewModalRef: NgbModalRef | null = null;

  editForm!: FormGroup;
  editModalRef: NgbModalRef | null = null;
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.fetchBookings();
  }

  fetchBookings(): void {
    this.loading = true;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<{ data: Booking[] }>('http://localhost:3000/customer/bookings', { headers })
      .subscribe({
        next: (res) => {
          this.bookings = res.data;
          this.loading = false;
        },
        error: () => {
          this.toastr.error('Failed to load bookings');
          this.loading = false;
        }
      });
  }

  openDeleteModal(content: TemplateRef<unknown>, booking: Booking): void {
    this.selectedBooking = booking;
    this.modalService.open(content, { centered: true });
  }

  deleteBooking(modal: NgbModalRef): void {
    if (!this.selectedBooking) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.delete(`http://localhost:3000/customer/bookings/${this.selectedBooking.id}`, { headers })
      .subscribe({
        next: () => {
          this.bookings = this.bookings.filter(b => b.id !== this.selectedBooking?.id);
          this.toastr.success('Booking deleted successfully');
          modal.close();
        },
        error: () => {
          this.toastr.error('Failed to delete booking');
          modal.close();
        }
      });
  }

  openEditModal(template: TemplateRef<unknown>, booking: Booking): void {
    this.selectedBooking = booking;
    this.editForm = this.fb.group({
      enddate: [
        booking.enddate.substring(0, 10),
        [
          Validators.required,
          (control: AbstractControl) => {
            const selectedDate = new Date(control.value);
            const today = new Date(this.today);
            return selectedDate >= today ? null : { pastDate: true };
          }
        ]
      ]
    });

    this.editModalRef = this.modalService.open(template, { centered: true });
  }

  submitEdit(): void {
    if (!this.selectedBooking || this.editForm.invalid) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const enddate = new Date(this.editForm.value.enddate).toISOString();

    this.http.patch(`http://localhost:3000/customer/bookings/${this.selectedBooking.id}`, { enddate }, { headers })
      .subscribe({
        next: () => {
          this.toastr.success('Booking updated');
          this.fetchBookings();
          this.editModalRef?.close();
        },
        error: () => {
          this.toastr.error('Update failed');
          this.editModalRef?.close();
        }
      });
  }

  openReviewModal(template: TemplateRef<unknown>, booking: Booking): void {
    this.selectedBooking = booking;
    this.reviewText = '';
    this.reviewModalRef = this.modalService.open(template, { centered: true });
  }

  submitReview(): void {
    if (!this.reviewText || !this.selectedBooking) return;

    console.log(`Review for ${this.selectedBooking.vehicle.title}:`, this.reviewText);
    this.toastr.success('Thank you for your review!');
    this.reviewModalRef?.close();
  }
}
