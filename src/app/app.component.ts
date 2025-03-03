import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'UNIEVENTOS';
  isMenuOpen = false; 

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  footer = '© 2024 UNIEVENTOS - Todos los derechos reservados';
}
