import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dato-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dato-admin.component.html',
  styleUrls: ['./dato-admin.component.css']
})
export class DatoAdminComponent {
  adminData = {
    cedula: '',
    nombreCompleto: '',
    direccion: '',
    telefono: '',
    correo: '',
    nuevaContrasena: '',
    confirmarContrasena: ''
  };


  isEditing = false;

  toggleEditing() {
    this.isEditing = !this.isEditing;
  }

  eliminarAdmin() {
    if (confirm('¿Está seguro que desea eliminar este administrador? Esta acción no se puede deshacer.')) {
      // Aquí iría la lógica para eliminar el administrador
      alert('Administrador eliminado con éxito');
    }
  }

  guardarCambios() {
    // Aquí iría la lógica para guardar los cambios
    alert('Cambios guardados exitosamente');
    this.isEditing = false;
  }
}