import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router'; // ✅ add NavigationEnd here
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  isLoggedIn = false; // Replace this with real auth logic

  constructor(private router: Router) {}

  toggleLogin() {
    this.isLoggedIn = !this.isLoggedIn;
  }

  ngOnInit(): void {
    // ✅ Close mobile menu when navigation happens
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const toggle = document.getElementById('menu-toggle') as HTMLInputElement;
        if (toggle) toggle.checked = false;
      }
    });
  }
}
