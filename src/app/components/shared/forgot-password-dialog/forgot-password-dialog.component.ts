import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password-dialog',
  standalone: true,
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ForgotPasswordDialogComponent {
  correo: string = '';
  message: string = '';
  success: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ForgotPasswordDialogComponent>,
    private authService: AuthService,
    private router: Router
  ) {}

  sendRecoveryEmail() {
    if (!this.correo) {
      Swal.fire('⚠️ Por favor, ingrese un correo electrónico válido.');
      return;
    }

    this.authService.recuperarPassword(this.correo).subscribe({
      next: () => {
        Swal.fire('✅ Revisa tu correo para recuperar tu contraseña.').then(() => {
          this.dialogRef.close();
          this.router.navigate(['/actualizar-password'], { queryParams: { correo: this.correo } });
        });
        this.success = true;
      },
      error: () => {
        Swal.fire('❌ Error al enviar el correo. Intente de nuevo.');
        this.success = false;
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
