import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent implements OnInit {
  // Tracks whether the user is currently logged in
  isLoggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Listen for login/logout changes from AuthService.
    // Whenever the login state changes, update the navbar display.
    this.authService.isLoggedIn$.subscribe(state => {
      this.isLoggedIn = state;
    });

    // Automatically close the mobile menu whenever the route changes.
    // This prevents the menu from staying open after navigation.
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const toggle = document.getElementById('menu-toggle') as HTMLInputElement;
        if (toggle) toggle.checked = false;
      }
    });
  }

  logout() {
    // Log the user out, then redirect them to the home page.
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
