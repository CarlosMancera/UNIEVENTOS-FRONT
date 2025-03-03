import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';


@Component({
  selector: 'app-crear-cupon',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './crear-cupon.component.html',
  styleUrls: ['./crear-cupon.component.css']
})
export class CrearCuponComponent {
  nuevoCupon = {
    codigo: '',
    descuento: 0,
    expiracion: '',
    limiteUso: 0,
    tipo: 'Único',
    estado: 'Activo'
  };

  constructor(private router: Router) {}

  guardarCupon() {
    // Aquí iría la lógica para guardar el cupón
    console.log('Cupón a guardar:', this.nuevoCupon);
    this.router.navigate(['/admin/cupones']);
  }

  cancelar() {
    this.router.navigate(['/admin/cupones']);
  }
}