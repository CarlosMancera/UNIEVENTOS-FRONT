import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.css'
})
export class PerfilUsuarioComponent {
  userData ={
    cedula: '12345873',
    nombreCompleto: 'Khal Drogo',
    direccion: 'Tierras Dothraki',
    telefono: '12345852',
    correo: 'khaldrogo@email.com',
    nuevaContrasena: '',
    confirmarContrasena: ''
  };

  
  isEditing = false;

  toggleEditing() {
    this.isEditing = !this.isEditing;
  }

  eliminarPerfil() {
    if (confirm('¿Está seguro que desea eliminar este usuario? Esta acción no se puede deshacer.')) {
      // Aquí iría la lógica para eliminar el usuario
      alert('Usuario eliminado con éxito');
    }
  }

  guardarCambios() {
    // Aquí iría la lógica para guardar los cambios
    alert('Cambios guardados exitosamente');
    this.isEditing = false;
  }

}
