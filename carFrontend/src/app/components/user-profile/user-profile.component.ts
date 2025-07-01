import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserProfileService } from '../../services/user-profile.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
  profileForm!: FormGroup;
  selectedImage?: File;
  imagePreviewUrl?: string;
  loading = false;

  userId!: string;
  token!: string;

  constructor(
    private fb: FormBuilder,
    private profileService: UserProfileService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('userId');
    const storedToken = localStorage.getItem('token');

    if (!storedId || !storedToken) {
      this.toastr.error('User not authenticated');
      // this.router.navigate(['/login']);
      return;
    }

    this.userId = storedId;
    this.token = storedToken;

    this.profileForm = this.fb.group({
      bio: ['', Validators.required],
      address: ['', Validators.required],
    });

    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getProfile(this.userId, this.token).subscribe({
      next: (res) => {
        this.profileForm.patchValue(res.data);
        this.imagePreviewUrl = res.data.imageUrl || res.data.avatarUrl || undefined;

        this.toastr.success('Profile loaded!');
      },
      error: () => this.toastr.error('Failed to load profile'),
    });
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.toastr.warning('Please fill in all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('bio', this.profileForm.value.bio);
    formData.append('address', this.profileForm.value.address);
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.loading = true;

    this.profileService
      .createOrUpdateProfile(this.userId, formData, this.token)
      .subscribe({
        next: () => {
          this.toastr.success('Profile updated successfully!');
          this.loading = false;
        },
        error: () => {
          this.toastr.error('Error updating profile');
          this.loading = false;
        },
      });
  }
}
