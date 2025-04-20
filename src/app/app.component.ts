import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { BcLoadingComponent } from './components/bc-loading/bc-loading.component';
import { BcLoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, BcLoadingComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'UNIEVENTOS';
  isMenuOpen = false;
  dropdownVisible = false;
  footer = '© 2025 UNIEVENTOS - Todos los derechos reservados';
  usuarioNombre = '';

  constructor(public authService: AuthService, private router: Router, private bcLoadingService: BcLoadingService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.usuarioNombre = user?.name ?? '';
    });

    this.authService.checkAuthentication();
  }


  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.dropdownVisible = !this.dropdownVisible;
  }

  logout(event: Event): void {
    this.bcLoadingService.show('Cerrando sesion...');
    event.stopPropagation();
    this.authService.logout().subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigate(['/']);
        this.bcLoadingService.close();
      },
      error: (err) => {
        console.error(err);
        this.router.navigate(['/']);
        this.bcLoadingService.close();
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    this.isMenuOpen = false;
    this.dropdownVisible = false;
  }


}
