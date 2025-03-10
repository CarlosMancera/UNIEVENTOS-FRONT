import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './actualizar-password.component.html',
  styleUrls: ['./actualizar-password.component.css']
})
export class ActualizarPasswordComponent implements OnInit {
  correo: string = '';
  codigo: string = '';
  nuevaPassword: string = '';
  confirmarPassword: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Leer el query parameter "correo" y asignarlo al campo correo
    this.route.queryParams.subscribe(params => {
      if (params['correo']) {
        this.correo = params['correo'];
      }
    });
  }

  actualizarPassword() {
    if (!this.correo || !this.codigo || !this.nuevaPassword || !this.confirmarPassword) {
      Swal.fire("⚠️ Todos los campos son obligatorios.");
      return;
    }

    if (this.nuevaPassword !== this.confirmarPassword) {
      Swal.fire("⚠️ Las contraseñas no coinciden.");
      return;
    }

    const dto = {
      email: this.correo,
      codigo: this.codigo,
      nuevaPassword: this.nuevaPassword
    };

    this.authService.actualizarPassword(dto).subscribe({
      next: (response) => {
        if (!response.error && response.respuesta === true) {
          Swal.fire("✅ Contraseña actualizada correctamente.");
          this.router.navigate(['/login']);
        } else {
          Swal.fire("❌ Error: el código es incorrecto o ha expirado.");
        }
      },
      error: () => {
        Swal.fire("❌ Error al actualizar la contraseña. Intente de nuevo.");
      }
    });
  }
}
