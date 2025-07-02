import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  role = ['ADMIN', 'CUSTOMER', 'AGENT'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^\\+254\\d{9}$'),
          Validators.minLength(10)
        ]
      ],
      role: ['CUSTOMER', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.authService.handleRegister(this.registerForm.value);
  }

  toggleVisibility() {
    this.showPassword = !this.showPassword;
  }

  isInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!control?.invalid && control?.touched;
  }
}
