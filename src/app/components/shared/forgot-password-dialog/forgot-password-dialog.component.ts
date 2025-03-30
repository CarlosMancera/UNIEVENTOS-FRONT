// forgot-password-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password-dialog',
  standalone: true,
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class ForgotPasswordDialogComponent {
  correo: string = '';
  message: string = '';
  success: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ForgotPasswordDialogComponent>,
    private authService: AuthService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  sendRecoveryEmail() {
    if (!this.correo) {
      this.message = 'Por favor, ingrese un correo electrónico válido.';
      this.success = false;
      return;
    }

    this.authService.recuperarPassword(this.correo).subscribe({
      next: () => {
        this.success = true;
        this.message = '✅ Revisa tu correo para recuperar tu contraseña.';
        setTimeout(() => {
          this.dialogRef.close();
          this.router.navigate(['/actualizar-password'], {
            queryParams: { correo: this.correo }
          });
        }, 2000);
      },
      error: () => {
        this.success = false;
        this.message = '❌ Error al enviar el correo. Intente de nuevo.';
      }
    });
  }

  cancelar() {
    this.dialogRef.close();
  }
}
