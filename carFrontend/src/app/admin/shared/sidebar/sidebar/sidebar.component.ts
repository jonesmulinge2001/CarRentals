import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  collapsed = false;
  showSidebar = true;

  navItems = [
    { label: 'Dashboard', link: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Vehicles', link: '/admin/vehicles', icon: 'directions_car' },
    { label: 'Bookings', link: '/admin/bookings', icon: 'event_available' },
    { label: 'Payments', link: '/admin/payments', icon: 'account_balance_wallet' },
    { label: 'Users', link: '/admin/users', icon: 'group' },
    { label: 'Customer Reviews', link: '/admin/reviews', icon: 'star_rate' },
    { label: 'Disputes', link: '/admin/disputes', icon: 'report_problem' }
  ];

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    const target = event.target as Window;
    this.showSidebar = target.innerWidth >= 768;
  }

  ngOnInit(): void {
    this.showSidebar = window.innerWidth >= 768;
  
    const savedMode = localStorage.getItem('theme');
    if (savedMode === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }
  
  toggleDarkMode(): void {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
  

  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  logout(): void{
    localStorage.removeItem('token');
      this.router.navigate(['/login']);
  }
}
