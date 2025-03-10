import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'UNIEVENTOS';
  // Variable para controlar el menú móvil
  isMenuOpen = false;
  // Variable para controlar el dropdown del usuario
  dropdownVisible = false;
  footer = '© 2024 UNIEVENTOS - Todos los derechos reservados';

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.checkAuthentication();
  }

  // Alterna el menú móvil y evita que el clic se propague
  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Alterna el dropdown del usuario y evita que el clic se propague
  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.dropdownVisible = !this.dropdownVisible;
  }

  logout(event: Event): void {
    event.stopPropagation();
    this.authService.logout().subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        this.router.navigate(['/']);
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    this.isMenuOpen = false;
    this.dropdownVisible = false;
  }
}
