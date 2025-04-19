import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { Team } from '../../../models/team.model';
import { TeamService } from '../../../services/Team.service';
import { ImagenService } from '../../../services/ImagenService.service';
import { BcLoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-modal-equipo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './modal-equipo.component.html',
  styleUrls: ['./modal-equipo.component.css']
})
export class ModalEquipoComponent {
  equipo: Team = {
    nombre: '',
    ciudad: '',
    entrenador: '',
    escudoUrl: ''
  };

  imagenSeleccionada?: File;

  constructor(
    private ref: MatDialogRef<ModalEquipoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Team | null,
    private teamService: TeamService,
    private http: HttpClient,
    private imagenService: ImagenService,
    private bcLoadingService: BcLoadingService

  ) {
    if (data) {
      this.equipo = { ...data };
    }
  }

  onFileChange(event: any): void {
    this.imagenSeleccionada = event.target.files[0];
  }

  subirImagenYGuardar(): void {
    this.bcLoadingService.show('Cargando datos...');
    if (!this.imagenSeleccionada) {
      this.guardarEquipo();
      return;
    }

    this.imagenService.subirImagen(this.imagenSeleccionada).subscribe({
      next: (url: string) => {
        this.equipo.escudoUrl = url;
        this.guardarEquipo();
      },
      error: () => {
        alert('Error al subir la imagen');
        this.bcLoadingService.close();
      }
    });
  }

  guardarEquipo(): void {
    if (this.equipo.id) {
      this.teamService.actualizar(this.equipo.id, this.equipo).subscribe(() => this.ref.close(true));
    } else {
      this.teamService.crear(this.equipo).subscribe(() => this.ref.close(true));
    }
    this.bcLoadingService.close();
  }

  cancelar(): void {
    this.ref.close(false);
  }
}
