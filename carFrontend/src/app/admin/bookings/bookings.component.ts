import { Component, OnInit, TemplateRef } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../booking.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-bookings',
  templateUrl: './bookings.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class AdminBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  selectedBooking?: Booking;
  pendingAction: 'Approve' | 'Reject' | 'Delete' | '' = '';
  loading = true;

  constructor(
    private bookingService: BookingService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.fetchBookings();
  }

  fetchBookings(): void {
    this.loading = true;
    this.bookingService.getAllBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch bookings:', err);
        this.loading = false;
      }
    });
  }

  openConfirmation(modalContent: TemplateRef<any>, booking: Booking, action: 'Approve' | 'Reject' | 'Delete'): void {
    this.selectedBooking = booking;
    this.pendingAction = action;
    this.modalService.open(modalContent, { centered: true, size: 'sm' });
  }

  performAction(modalRef: any): void {
    if (!this.selectedBooking) return;

    const id = this.selectedBooking.id;

    switch (this.pendingAction) {
      case 'Approve':
        this.bookingService.updateBooking(id, { status: 'CONFIRMED' }).subscribe(() => this.fetchBookings());
        break;
      case 'Reject':
        this.bookingService.updateBooking(id, { status: 'PENDING' }).subscribe(() => this.fetchBookings());
        break;
      case 'Delete':
        this.bookingService.deleteBooking(id).subscribe(() => this.fetchBookings());
        break;
    }

    // Reset and close modal
    this.selectedBooking = undefined;
    this.pendingAction = '';
    modalRef.close();
  }
}
