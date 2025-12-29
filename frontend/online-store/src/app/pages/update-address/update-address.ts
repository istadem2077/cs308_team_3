import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, AddressUpdateRequest } from '../../services/auth';

@Component({
  selector: 'app-update-address',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './update-address.html',
  styleUrls: ['./update-address.css']
})
export class UpdateAddressComponent implements OnInit {
  addressForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    const currentAddress = localStorage.getItem('address') || '';

    this.addressForm = this.fb.group({
      address: [currentAddress, Validators.required]
    });
  }

  get f() {
    return this.addressForm.controls;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    const data: AddressUpdateRequest = {
      id: userId,
      address: this.addressForm.value.address
    };

    this.authService.updateAddress(data).subscribe({
      next: (response) => {
        this.isLoading = false;
        localStorage.setItem('address', data.address);
        this.successMessage = 'Address updated successfully!';
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to update address. Please try again.';
        console.error('Update Address Error:', err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/profile']);
  }
}

