import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-artista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-artista.component.html',
  styleUrls: ['./crear-artista.component.css']
})
export class CrearArtistaComponent {
  nuevoArtista = {
    id: '',
    nombre: '',
    genero: '',
    email: '',
    telefono: '',
    estado: 'Disponible'
  };

  constructor(private router: Router) {}

  guardarArtista() {
    // Aquí iría la lógica para guardar el artista
    console.log('Artista a guardar:', this.nuevoArtista);
    this.router.navigate(['/admin/artistas']);
  }

  cancelar() {
    this.router.navigate(['/admin/artistas']);
  }
}