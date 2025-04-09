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
  imagenPortadaFile!: File;
  imagenLocalidadesFile!: File;
  localidadFiles: { [index: number]: File } = {};

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
    delete this.localidadFiles[index];
  }

  onFileChange(event: any, tipo: string, index?: number) {
    const file = event.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);

    if (tipo === 'portada') {
      this.crearEventoForm.patchValue({ imagenPortada: objectUrl });
      this.imagenPortadaFile = file;
    } else if (tipo === 'localidadesGeneral') {
      this.crearEventoForm.patchValue({ imagenLocalidades: objectUrl });
      this.imagenLocalidadesFile = file;
    } else if (tipo === 'localidades' && index !== undefined) {
      this.localidades.at(index).patchValue({ imagen: objectUrl });
      this.localidadFiles[index] = file;
    }
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
    const clone = JSON.parse(JSON.stringify(evento));

    clone.localidades.forEach((loc: any) => delete loc.imagen);
    delete clone.imagenPortada;
    delete clone.imagenLocalidades;

    this.httpClient.post<any>(ENDPOINTS.crearEvento, clone).subscribe({
      next: (res) => {
        const idEvento = res.respuesta;
        this.subirImagenes(idEvento);
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

  subirImagenes(idEvento: number) {
    const pathParams = new Map<string, string>();
    pathParams.set('idEvento', idEvento.toString());

    const portadaForm = new FormData();
    portadaForm.append('imagen', this.imagenPortadaFile);
    this.httpClient.post<any>(ENDPOINTS.agregarImagenEvento, portadaForm, pathParams).subscribe();

    const localidadGeneralForm = new FormData();
    localidadGeneralForm.append('imagen', this.imagenLocalidadesFile);
    this.httpClient.post<any>(ENDPOINTS.agregarImagenLocalidad, localidadGeneralForm, new Map<string, string>([
      ['idEvento', idEvento.toString()],
      ['nombreLocalidad', 'general']
    ])).subscribe();

    this.localidades.controls.forEach((loc, index) => {
      const file = this.localidadFiles[index];
      const nombre = loc.get('nombre')?.value;

      if (file && nombre) {
        const form = new FormData();
        form.append('imagen', file);
        this.httpClient.post<any>(ENDPOINTS.agregarImagenLocalidad, form, new Map<string, string>([
          ['idEvento', idEvento.toString()],
          ['nombreLocalidad', nombre]
        ])).subscribe();
      }
    });
  }
}
