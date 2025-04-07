import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { HttpClientService } from '../../../services/HttpClientService.service';
import { ENDPOINTS } from '../../../core/endpoints';

@Component({
  selector: 'app-crear-evento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './crear-evento.component.html',
  styleUrls: ['./crear-evento.component.css']
})
export class CrearEventoComponent implements OnInit {
  crearEventoForm!: FormGroup;
  tiposDeEvento = ['CONCIERTO', 'RECITAL', 'PARTIDO DE FUTBOL'];
  ciudades = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla'];
  artistas: any[] = [];

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClientService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.listarArtistas();
  }

  private crearFormulario() {
    this.crearEventoForm = this.fb.group({
      nombre: ['', Validators.required],
      artista: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha: ['', Validators.required],
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      tipoEvento: ['', Validators.required],
      imagenPortada: ['', Validators.required],
      imagenLocalidades: ['', Validators.required],
      localidades: this.fb.array([])
    });
  }

  get localidades(): FormArray {
    return this.crearEventoForm.get('localidades') as FormArray;
  }

  agregarLocalidad() {
    const localidadForm = this.fb.group({
      nombre: ['', Validators.required],
      precio: ['', Validators.required],
      capacidad: ['', Validators.required],
      descripcion: ['', Validators.required],
      imagen: ['', Validators.required]
    });
    this.localidades.push(localidadForm);
  }

  eliminarLocalidad(index: number) {
    this.localidades.removeAt(index);
  }

  onFileChange(event: any, tipo: string, index?: number) {
    const file = event.target.files[0];
    if (!file) return;

    const extension = file.name.split('.').pop();
    const uniqueName = `${tipo}_${Date.now()}_${Math.floor(Math.random() * 1000)}.${extension}`;
    const localPath = `assets/imagenes/eventos/${uniqueName}`;

    const reader = new FileReader();
    reader.onload = () => {
      if (tipo === 'portada') {
        this.crearEventoForm.patchValue({ imagenPortada: localPath });
      } else if (tipo === 'localidadesGeneral') {
        this.crearEventoForm.patchValue({ imagenLocalidades: localPath });
      } else if (tipo === 'localidades' && index !== undefined) {
        this.localidades.at(index).patchValue({ imagen: localPath });
      }
    };
    reader.readAsDataURL(file);
  }

  listarArtistas() {
    this.httpClient.get<any>(ENDPOINTS.listarArtistas).subscribe({
      next: (data) => {
        this.artistas = data.respuesta || [];
      },
      error: (err) => {
        console.error('Error al listar artistas:', err);
      }
    });
  }

  onSubmit() {
    if (this.crearEventoForm.invalid) {
      this.crearEventoForm.markAllAsTouched();
      return;
    }

    const evento = this.crearEventoForm.value;
    this.httpClient.post<any>(ENDPOINTS.crearEvento, evento).subscribe({
      next: () => {
        alert('Evento creado exitosamente');
        this.crearEventoForm.reset();
        this.localidades.clear();
      },
      error: (err) => {
        console.error('Error al crear evento:', err);
        alert('Error al crear el evento');
      }
    });
  }
}
