import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { PublicoService } from '../../../services/publico.service';
import { AdministradorService } from '../../../services/administrador.service';

@Component({
  selector: 'app-crear-evento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './crear-evento.component.html',
  styleUrls: ['./crear-evento.component.css']
})
export class CrearEventoComponent {
  crearEventoForm!: FormGroup;
  tiposDeEvento = [];
  ciudades = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla'];
  imagenPortada!: File;
  imagenLocalidades!: File;

  constructor(private fb: FormBuilder, private publicoService: PublicoService, private adminService:AdministradorService) {
    this.crearFormulario();
    this.tiposDeEvento = [];
    this.ciudades = [];
    this.listarTipos();

  }

  private crearFormulario() {
    this.crearEventoForm = this.fb.group({
      nombre: ['', Validators.required],
      artista: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha: ['', Validators.required],
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      tipo: ['', Validators.required],
      imagenPortada: ['', Validators.required],
      imagenLocalidades: ['', Validators.required],
      localidades: this.fb.array([])
    });
  }

  get localidades() {
    return this.crearEventoForm.get('localidades') as FormArray;
  }

  agregarLocalidad() {
    const localidadForm = this.fb.group({
      nombre: ['', Validators.required],
      precio: ['', Validators.required],
      capacidad: ['', Validators.required]
    });

    this.localidades.push(localidadForm);
  }

  eliminarLocalidad(index: number) {
    this.localidades.removeAt(index);
  }

  onFileChange(event: any, tipo: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if(tipo === 'portada') {
        this.imagenPortada = file;
      } else {
        this.imagenLocalidades = file;
      }
    }
  }

  onSubmit() {
    if (this.crearEventoForm.valid) {
      console.log(this.crearEventoForm.value);
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.crearEventoForm.controls).forEach(key => {
        const control = this.crearEventoForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  public listarTipos(){
    this.publicoService.listarTipos().subscribe({
      next: (data) => {
        this.tiposDeEvento = data.respuesta;
      },
      error: (error) => {
        console.error(error);
      },
    });
   }

   public subirImagen(tipoImagen:string){

    const formData = new FormData();

    if(tipoImagen == "portada"){
      formData.append("imagen", this.imagenPortada );
    }else{
      formData.append("imagen", this.imagenLocalidades );
    }

    this.adminService.subirImagen(formData).subscribe({
      next: data => {
        if(tipoImagen == "portada"){
          this.crearEventoForm.patchValue({
            imagenPortada: data.respuesta
          });
        }else{
          this.crearEventoForm.patchValue({
            imagenLocalidades: data.respuesta
          });
        }
      },
      error: error => {

      }
    });
   }
   
   
}