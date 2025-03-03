import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-artista-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './artista-admin.component.html',
  styleUrls: ['./artista-admin.component.css']
})
export class ArtistaAdminComponent {
  artistas = [
    {
      nombre: 'Banda Cura',
      genero: 'Rock',
      estado: 'Disponible',
      email: 'cura@email.com',
      telefono: '1234566'
    },
    {
      nombre: 'Diego Verdaguer',
      genero: 'Balada',
      estado: 'Disponible',
      email: 'diegover@email.com',
      telefono: '1234567'
    },
    {
      nombre: 'Circo del Sol',
      genero: 'Espectáculo',
      estado: 'Disponible',
      email: 'circosol@email.com',
      telefono: '1234586'
    },
    {
      nombre: 'Dimash Kudaibergen',
      genero: 'Tenor',
      estado: 'Ocupado',
      email: 'dimash@email.com',
      telefono: '1234569'
    },
    {
      nombre: 'Harry Houdini',
      genero: 'Magia',
      estado: 'Disponible',
      email: 'houdinimago@email.com',
      telefono: '6666566'
    }
  ];

  agregarArtista() {
    // Implementar lógica para agregar artista
  }

  eliminarArtista(nombre: string) {
    if(confirm('¿Está seguro que desea eliminar este artista?')) {
      // Implementar lógica para eliminar artista
    }
  }

  editarArtista(nombre: string) {
    // Implementar lógica para editar artista
  }
}