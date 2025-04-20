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

  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService,
    private dialog: MatDialog,
    private bcLoadingService: BcLoadingService
  ) {}

  onSubmit() {
    this.bcLoadingService.show('Iniciando sesión...');

    this.authService.iniciarSesion(this.loginData).subscribe({
      next: (data) => {
        if (data.error) {
          this.bcLoadingService.close();
          Swal.fire('Error', data.respuesta || 'Error desconocido', 'error');
          return;
        }

        const token = data.respuesta.token;
        localStorage.setItem('token', token);
        const user = this.authService.decodeToken(token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.authService.checkAuthentication();

        this.bcLoadingService.close();

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

        if (error?.error?.respuesta) {
          mensaje = error.error.respuesta;
        } else if (typeof error?.error === 'string') {
          mensaje = error.error;
        } else if (error?.message) {
          mensaje = error.message;
        }

        Swal.fire('Error', mensaje, 'error');
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
}
