import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cupon-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cupon-admin.component.html',
  styleUrls: ['./cupon-admin.component.css']
})
export class CuponAdminComponent {
  cupones = [
    {
      codigo: '',
      descuento: '',
      expiracion: '',
      tipo: '',
      uso: '',
      estado: ''
    }   
    
  ];

  historialCupones = [
    {
      codigo: '',
      usuario: '',
      fechaUso: '',
      evento: ''
    },
    
  ];

  crearCupon() {
    // Implementar lógica para crear cupón
  }

  eliminarCupon(codigo: string) {
    if(confirm('¿Está seguro que desea eliminar este cupón?')) {
      // Implementar lógica para eliminar cupón
    }
  }

  editarCupon(codigo: string) {
    // Implementar lógica para editar cupón
  }
}