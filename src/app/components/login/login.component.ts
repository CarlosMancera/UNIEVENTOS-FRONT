import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { LoginDTO } from '../../dto/LoginDTO';
import { TokenService } from '../../services/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule], // ✅ Importar NgbModalModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: LoginDTO = { email: '', password: '' };
  correo: string = '';  // Almacena el correo del usuario para recuperación
  message: string = '';
  success: boolean = false;
  modalRef!: NgbModalRef;

  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService,
    private modalService: NgbModal
  ) {}

  onSubmit() {
    this.authService.iniciarSesion(this.loginData).subscribe({
      next: (data) => {
        if (data.error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.respuesta || 'Error desconocido'
          });
          return;
        }

        const token = data.respuesta.token;
        localStorage.setItem('token', token);

        const user = this.authService.decodeToken(token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.authService.checkAuthentication();

        if (user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user/perfil']);
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error?.error?.respuesta || 'Error en la solicitud'
        });
      }
    });
  }


  openForgotPasswordModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  sendRecoveryEmail() {
    if (!this.correo) {
      Swal.fire("⚠️ Por favor, ingrese un correo electrónico válido.");
      return;
    }

    this.authService.recuperarPassword(this.correo).subscribe({
      next: () => {
        Swal.fire("✅ Revisa tu correo para recuperar tu contraseña.").then(() => {
          // Cierra TODOS los modales abiertos
          this.modalService.dismissAll();
          // Redirige al componente para actualizar la contraseña
          this.router.navigate(['/actualizar-password'], { queryParams: { correo: this.correo } });
        });
        this.success = true;
      },
      error: () => {
        Swal.fire("❌ Error al enviar el correo. Intente de nuevo.");
        this.success = false;
      }
    });
  }

}
