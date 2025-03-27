import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { HttpClientService } from '../../../services/HttpClientService.service';
import { ENDPOINTS } from '../../../core/endpoints';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css'],
})
export class PerfilUsuarioComponent implements OnInit {
  form!: FormGroup;
  isEditing = false;

  constructor(
    private authService: AuthService,
    private httpClientService: HttpClientService
  ) {}

  ngOnInit(): void {

    // this.prueba();
    this.form = new FormGroup({
      cedula: new FormControl({ value: '', disabled: true }),
      nombreCompleto: new FormControl(''),
      direccion: new FormControl(''),
      telefono: new FormControl(''),
      correo: new FormControl(''),
      nuevaContrasena: new FormControl(''),
      confirmarContrasena: new FormControl('')
    });

    const userId = this.authService.getUserIdFromToken();
    if (userId !== null) {
      const pathParams = new Map<string, string>();
      pathParams.set('id', userId.toString());

      this.httpClientService
        .get<any>(ENDPOINTS.recuperaInfoCuenta, pathParams)
        .subscribe({
          next: (data) => {
            this.form.patchValue({
              cedula: data.cedula,
              nombreCompleto: data.nombre,
              direccion: data.direccion,
              telefono: data.telefono,
              correo: data.email
            });
            this.form.disable();
          },
          error: (err) => {
            console.error('Error al obtener información de cuenta:', err);
          }
        });
    }
  }

  toggleEditing() {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.form.enable();
      this.form.get('cedula')?.disable();
      this.form.get('correo')?.disable();
    } else {
      this.form.disable();
    }
  }

  eliminarPerfil() {
    const confirmacion = confirm('¿Está seguro que desea eliminar este usuario? Esta acción no se puede deshacer.');

    if (!confirmacion) return;

    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      alert('No se pudo obtener el ID del usuario.');
      return;
    }

    const pathParams = new Map<string, string>();
    pathParams.set('id', userId.toString());

    this.httpClientService.delete<void>(ENDPOINTS.eliminarCuenta, pathParams).subscribe({
      next: () => {
        alert('Cuenta eliminada con éxito');

        // ⚠️ Limpieza manual porque ya no hay sesión ni usuario en el backend
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        this.authService['currentUserSubject'].next(null);

        // Redireccionamos
        window.location.href = '/login';
      },
      error: (err) => {
        console.error('Error al eliminar la cuenta:', err);
        alert('Error al eliminar la cuenta: ' + (err.error?.mensaje || err.message));
      }
    });
  }


  prueba(){
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        this.authService['currentUserSubject'].next(null);

        // Redireccionamos
        window.location.href = '/login';
  }

  guardarCambios() {
    if (this.form.valid) {
      const userId = this.authService.getUserIdFromToken();
      if (!userId) {
        alert("No se pudo obtener el ID del usuario");
        return;
      }

      const body = {
        id: userId.toString(),
        nombre: this.form.get('nombreCompleto')?.value,
        telefono: this.form.get('telefono')?.value,
        direccion: this.form.get('direccion')?.value,
        nuevaContrasena: this.form.get('nuevaContrasena')?.value,
        confirmarContrasena: this.form.get('confirmarContrasena')?.value
      };

      this.httpClientService.put<void>(ENDPOINTS.editarCuenta, body).subscribe({
        next: () => {
          alert('Cambios guardados exitosamente');
          this.isEditing = false;
          this.form.disable();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          alert(
            'Error al actualizar la cuenta: ' +
            (err.error?.mensaje ? err.error.mensaje : err.message)
          );
                  }
      });
    } else {
      alert('Completa todos los campos obligatorios correctamente.');
    }
  }

}
