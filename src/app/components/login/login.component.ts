import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { LoginDTO } from '../../dto/LoginDTO';
import { TokenService } from '../../services/token.service';
import { ForgotPasswordDialogComponent } from '../shared/forgot-password-dialog/forgot-password-dialog.component';
import Swal from 'sweetalert2';
import { BcLoadingService } from '../../services/loading.service';
import { environment } from '../../../environments/environment.test';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: LoginDTO = { email: '', password: '' };
  recaptchaRendered = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService,
    private dialog: MatDialog,
    private bcLoadingService: BcLoadingService
  ) {}

  ngAfterViewInit(): void {
    if (!environment.enableCaptcha) {
      this.recaptchaRendered = true;
      return;
    }

    const interval = setInterval(() => {
      if ((window as any).grecaptcha && !this.recaptchaRendered) {
        (window as any).grecaptcha.render('recaptcha-container', {
          sitekey: '6LcU7R4rAAAAAD2uxlm1CiweNhLdDDH3ynqmDv8B'
        });
        this.recaptchaRendered = true;
        clearInterval(interval);
      }
    }, 300);
  }
  onSubmit() {
    const recaptchaToken = this.getRecaptchaToken();

    if (!recaptchaToken) {
      Swal.fire({
        icon: 'warning',
        title: 'Validación requerida',
        text: 'Por favor confirma que no eres un robot.',
        confirmButtonColor: '#ffd700'
      });
      return;
    }

    this.bcLoadingService.show('Iniciando sesión...');

    this.authService.iniciarSesion(this.loginData).subscribe({
      next: (data) => {
        this.bcLoadingService.close();

        if (data.error) {
          Swal.fire({
            icon: 'error',
            title: 'Error al iniciar sesión',
            text: data.respuesta || 'Error desconocido',
            confirmButtonColor: '#d33'
          });
          return;
        }

        const token = data.respuesta.token;
        localStorage.setItem('token', token);
        const user = this.authService.decodeToken(token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.authService.checkAuthentication();

        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: `Has iniciado sesión como ${user.name}`,
          confirmButtonColor: '#28a745',
          timer: 2000,
          showConfirmButton: false
        });

        if (user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.bcLoadingService.close();
        console.error('❌ Error completo:', error);

        let mensaje = 'Ocurrió un error inesperado.';
        let icon: 'warning' | 'error' = 'error';

        if (error.status === 409) {
          mensaje = error.error?.respuesta || '⚠️ El usuario ya tiene una sesión activa.';
          icon = 'warning';

        } else if (error.status === 404) {
          mensaje = error.error?.respuesta || '❌ El correo no está registrado.';
          icon = 'error';

        } else if (error?.error?.respuesta?.toLowerCase().includes('credenciales')) {
          mensaje = '❌ Correo o contraseña incorrectos.';
          icon = 'error';

        } else if (error?.error?.respuesta) {
          mensaje = error.error.respuesta;

        } else if (typeof error?.error === 'string') {
          mensaje = error.error;

        } else if (error?.message) {
          mensaje = error.message;
        }

        Swal.fire({
          icon,
          title: 'Error al iniciar sesión',
          text: mensaje,
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  openForgotPasswordModal() {
    this.dialog.open(ForgotPasswordDialogComponent, {
      width: '400px',
      disableClose: true
    });
  }

  get isFormValid(): boolean {
    return this.loginData.email.trim() !== '' && this.loginData.password.length >= 4;
  }

  getRecaptchaToken(): string | null {
    if (!environment.enableCaptcha) return 'fake-token';
    const token = (window as any).grecaptcha?.getResponse();
    return token && token.length > 0 ? token : null;
  }

}
