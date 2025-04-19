import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { Team } from '../../../models/team.model';
import { ModalEquipoComponent } from '../../../shared/modals/modal-equipo/modal-equipo.component';
import { TeamService } from '../../../services/Team.service';
import { BcLoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-equipo-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    ModalEquipoComponent
  ],
  templateUrl: './equipo-admin.component.html',
  styleUrls: ['./equipo-admin.component.css']
})
export class EquipoAdminComponent implements OnInit {
  equipos: Team[] = [];
  columnas: string[] = ['nombre', 'ciudad', 'entrenador', 'escudo', 'acciones'];

  constructor(
    private teamService: TeamService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private bcLoadingService: BcLoadingService
  ) {}

  ngOnInit(): void {
    this.cargarEquipos();
  }

  cargarEquipos() {
    this.teamService.listar().subscribe(data => this.equipos = data);
  }

  abrirModal(equipo?: Team) {
    const ref = this.dialog.open(ModalEquipoComponent, {
      width: '400px',
      data: equipo
    });

    ref.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.cargarEquipos();
        this.snackBar.open('Equipo guardado correctamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  eliminar(id: number) {
    this.bcLoadingService.show('Cargando datos...');
    this.teamService.eliminar(id).subscribe(() => {
      this.cargarEquipos();
      this.bcLoadingService.close();
      this.snackBar.open('Equipo eliminado', 'Cerrar', { duration: 3000 });
    });
  }
}
