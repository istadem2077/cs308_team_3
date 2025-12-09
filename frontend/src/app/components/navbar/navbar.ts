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
  isLoggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // 🔥 reactively update login state based on AuthService
    this.authService.isLoggedIn$.subscribe(state => {
      this.isLoggedIn = state;
    });

    // CLOSE MOBILE MENU ON ROUTING
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const toggle = document.getElementById('menu-toggle') as HTMLInputElement;
        if (toggle) toggle.checked = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
