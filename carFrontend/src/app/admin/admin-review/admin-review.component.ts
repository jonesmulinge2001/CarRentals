import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminReviewService } from '../../services/admin.service';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  vehicle: {
    title: string;
  };
}

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-review.component.html'
})
export class AdminReviewsComponent implements OnInit {
  reviews: Review[] = [];
  loading = false;

  constructor(private reviewService: AdminReviewService) {}

  ngOnInit(): void {
    this.fetchReviews();
  }

  fetchReviews(): void {
    this.loading = true;
    this.reviewService.getAllReviews().subscribe({
      next: (data) => {
        this.reviews = data;
        this.loading = false;
      },
      error: () => {
        console.error('Failed to fetch reviews');
        this.loading = false;
      }
    });
  }
}
