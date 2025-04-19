import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControlOptions } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CrearCuentaDTO } from '../../dto/cuentaDTO/CrearCuentaDTO';
import Swal from 'sweetalert2';
import { BcLoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  registroForm!: FormGroup;

  constructor(private router: Router, private bcLoadingService: BcLoadingService,
  private authService: AuthService, private formBuilder: FormBuilder) {
    this.crearFormulario();
  }

  private crearFormulario() {
    this.registroForm = this.formBuilder.group({
      cedula: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(4)]],
      confirmaPassword: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(4)]]
    },
    { validators: this.passwordsMatchValidator } as AbstractControlOptions
  );
  }

  passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmaPassword = formGroup.get('confirmaPassword')?.value;

    return password === confirmaPassword ? null : { passwordsMismatch: true };
  }

  public registrar() {
    this.bcLoadingService.show('Cargando datos...');

    const crearCuenta = this.registroForm.value as CrearCuentaDTO;
    this.authService.crearCuenta(crearCuenta).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Cuenta creada',
          text: 'La cuenta se ha creado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.router.navigate(['/']);
        this.bcLoadingService.close();
      },
      error: (error) => {
        this.bcLoadingService.close();
        Swal.fire({
          title: 'Error',
          text: error.error.respuesta,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  campos = [
    { name: 'cedula', placeholder: 'Cédula', type: 'text', icon: 'id-card.png' },
    { name: 'nombre', placeholder: 'Nombre Completo', type: 'text', icon: 'user1.png' },
    { name: 'direccion', placeholder: 'Dirección', type: 'text', icon: 'location.png' },
    { name: 'telefono', placeholder: 'Teléfono', type: 'tel', icon: 'phone.png' },
    { name: 'email', placeholder: 'Correo Electrónico', type: 'email', icon: 'email.png' },
    { name: 'password', placeholder: 'Contraseña', type: 'password', icon: 'password.png' },
    { name: 'confirmaPassword', placeholder: 'Repetir Contraseña', type: 'password', icon: 'password.png' }
  ];

}
