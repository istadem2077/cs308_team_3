import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, RegisterRequest } from '../../services/auth';
import { matchValidator } from '../../utils/validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'] // Re-using login styles for consistency
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, matchValidator('password')]],
      address: ['', Validators.required]
    });
  }

  // Helper to access form controls easily in the template
  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.errorMessage = ''; 

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const registerData: RegisterRequest = this.registerForm.value as RegisterRequest;
    
    // Safety check: remove form control not used by DTO
    delete registerData['confirmPassword' as keyof RegisterRequest];

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Registration successful, navigate to login or home/profile
        // In a real app, you might auto-login here, but for now, navigate to login page
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
        console.error('Registration Error:', err);
      }
    });
  }
}