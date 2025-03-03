import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginDTO } from '../../dto/LoginDTO';
import { TokenService } from '../../services/token.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: LoginDTO = { email: '', password: '' };
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  onSubmit() {
    this.authService.iniciarSesion(this.loginData).subscribe({
      next: (data) => {
        // Guarda el token en TokenService
        this.tokenService.setToken(data.respuesta.token);
        
        // Redirige al usuario según su rol (esto puede depender de tu lógica de roles)
        const user = this.authService.getCurrentUser();
        if (user?.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user/perfil']);
        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.respuesta || 'Credenciales inválidas'
        });
      }
    });
  }
}
