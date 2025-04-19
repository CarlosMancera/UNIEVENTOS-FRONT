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
    this.bcLoadingService.show('Cargando datos...');
    this.authService.iniciarSesion(this.loginData).subscribe({
      next: (data) => {
        if (data.error) {
          Swal.fire('Error', data.respuesta || 'Error desconocido', 'error');
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
          this.router.navigate(['/']);
        }
        this.bcLoadingService.close();
      },
      error: (error) => {
        this.bcLoadingService.close();
        Swal.fire('Error', error?.error?.respuesta || 'Error en la solicitud', 'error');
      }
    });
  }

  openForgotPasswordModal() {
    this.dialog.open(ForgotPasswordDialogComponent, {
      width: '400px',
      disableClose: true
    });
  }
}
