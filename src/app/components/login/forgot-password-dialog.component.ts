import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password-dialog',
  standalone: true,
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class ForgotPasswordDialogComponent {
  correo: string = '';

  constructor(
    private dialogRef: MatDialogRef<ForgotPasswordDialogComponent>,
    private authService: AuthService,
    private router: Router
  ) {}

  sendRecoveryEmail() {
    if (!this.correo) {
      Swal.fire("⚠️ Por favor, ingresa un correo electrónico válido.");
      return;
    }

    this.authService.recuperarPassword(this.correo).subscribe({
      next: () => {
        Swal.fire("✅ Revisa tu correo para recuperar tu contraseña.").then(() => {
          this.dialogRef.close();
          this.router.navigate(['/actualizar-password'], {
            queryParams: { correo: this.correo }
          });
        });
      },
      error: () => {
        Swal.fire("❌ Error al enviar el correo. Intenta de nuevo.");
      }
    });
  }

  cancelar() {
    this.dialogRef.close();
  }
}
