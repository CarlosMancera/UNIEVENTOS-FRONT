import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatchService } from '../../../services/match.service';
import { Match } from '../../../models/match.model';
import { Team } from '../../../models/team.model';
import { TeamService } from '../../../services/Team.service';
import { BcLoadingService } from '../../../services/loading.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-partidos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './partidos.component.html',
  styleUrl: './partidos.component.css'
})
export class PartidosComponent {
  searchTerm: string = '';
  ciudadLocal: string = '';
  ciudadVisitante: string = '';

  partidos: Match[] = [];
  equipos: Team[] = [];

  constructor(
    private matchService: MatchService,
    private teamService: TeamService,
    private bcLoadingService: BcLoadingService
  ) {
    this.cargarDatos();
  }

  cargarDatos() {
    this.bcLoadingService.show('Cargando datos...');

    forkJoin({
      partidos: this.matchService.listar(),
      equipos: this.teamService.listar()
    }).subscribe({
      next: ({ partidos, equipos }) => {
        this.partidos = partidos;
        this.equipos = equipos;
      },
      error: (err) => {
        console.error('❌ Error al cargar datos:', err);
      },
      complete: () => {
        this.bcLoadingService.close();
      }
    });
  }


  getCiudades(): string[] {
    const ciudades = this.equipos.map(e => e.ciudad);
    return [...new Set(ciudades)]; // sin duplicados
  }

  getCiudad(nombreEquipo: string): string {
    return this.equipos.find(e => e.nombre === nombreEquipo)?.ciudad ?? '';
  }

  filteredMatches() {
    return this.partidos.filter(partido => {
      const equipoLocal = partido.equipoLocal.toLowerCase();
      const equipoVisitante = partido.equipoVisitante.toLowerCase();
      const search = this.searchTerm.toLowerCase();

      const ciudadEquipoLocal = this.getCiudad(partido.equipoLocal).toLowerCase();
      const ciudadEquipoVisitante = this.getCiudad(partido.equipoVisitante).toLowerCase();

      const matchesEquipos = equipoLocal.includes(search) || equipoVisitante.includes(search);
      const matchesCiudadLocal = !this.ciudadLocal || ciudadEquipoLocal.includes(this.ciudadLocal.toLowerCase());
      const matchesCiudadVisitante = !this.ciudadVisitante || ciudadEquipoVisitante.includes(this.ciudadVisitante.toLowerCase());

      return matchesEquipos && matchesCiudadLocal && matchesCiudadVisitante;
    });
  }

  limpiarFiltros() {
    this.searchTerm = '';
    this.ciudadLocal = '';
    this.ciudadVisitante = '';
  }
}
