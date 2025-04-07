import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { HttpClientService } from '../../../services/HttpClientService.service';
import { ENDPOINTS } from '../../../core/endpoints';

@Component({
  selector: 'app-dato-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dato-admin.component.html',
  styleUrls: ['./dato-admin.component.css']
})
export class DatoAdminComponent implements OnInit {
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

  constructor(
    private authService: AuthService,
    private httpClientService: HttpClientService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      alert('No se pudo obtener el ID del usuario.');
      return;
    }

    const pathParams = new Map<string, string>();
    pathParams.set('id', userId.toString());

    this.httpClientService.get<any>(ENDPOINTS.recuperaInfoCuenta, pathParams).subscribe({
      next: (data) => {
        this.adminData = {
          cedula: data.cedula,
          nombreCompleto: data.nombre,
          direccion: data.direccion,
          telefono: data.telefono,
          correo: data.email,
          nuevaContrasena: '',
          confirmarContrasena: ''
        };
        this.isEditing = false;
      },
      error: (err) => {
        console.error('Error al obtener información del administrador:', err);
        alert('Error al obtener información del administrador.');
      }
    });
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;
  }

  eliminarAdmin() {
    if (!confirm('¿Está seguro que desea eliminar este administrador? Esta acción no se puede deshacer.')) return;

    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      alert('No se pudo obtener el ID del usuario.');
      return;
    }

    const pathParams = new Map<string, string>();
    pathParams.set('id', userId.toString());

    this.httpClientService.delete<void>(ENDPOINTS.eliminarCuenta, pathParams).subscribe({
      next: () => {
        alert('Administrador eliminado con éxito');
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        this.authService['currentUserSubject'].next(null);
        window.location.href = '/login';
      },
      error: (err) => {
        console.error('Error al eliminar la cuenta:', err);
        alert('Error al eliminar la cuenta: ' + (err.error?.mensaje || err.message));
      }
    });
  }

  guardarCambios() {
    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      alert('No se pudo obtener el ID del usuario.');
      return;
    }

    if (this.adminData.nuevaContrasena !== this.adminData.confirmarContrasena) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const body = {
      id: userId.toString(),
      nombre: this.adminData.nombreCompleto,
      telefono: this.adminData.telefono,
      direccion: this.adminData.direccion,
      nuevaContrasena: this.adminData.nuevaContrasena,
      confirmarContrasena: this.adminData.confirmarContrasena
    };

    this.httpClientService.put<void>(ENDPOINTS.editarCuenta, body).subscribe({
      next: () => {
        alert('Cambios guardados exitosamente');
        this.isEditing = false;
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        alert(
          'Error al actualizar el administrador: ' +
          (err.error?.mensaje ? err.error.mensaje : err.message)
        );
      }
    });
  }
}
