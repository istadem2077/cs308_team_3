import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {

  userId: number | null = null;
  name: string = '';
  email: string = '';
  address: string = '';
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.isLoggedIn = !!this.userId;

    if (!this.isLoggedIn) return;

    // Load user from API later if needed; for now from localStorage
    this.name = localStorage.getItem('name') || '';
    this.email = localStorage.getItem('email') || '';
    this.address = localStorage.getItem('address') || '';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
