import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { Match } from '../../models/match.model';
import { Team } from '../../models/team.model';
import { TeamService } from '../../services/Team.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnDestroy {
  partidos: Match[] = [];
  equipos: Team[] = [];
  currentSlide = 0;
  intervaloAutoPlay: any;

  constructor(private matchService: MatchService, private teamService: TeamService) {
    this.obtenerDatos();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervaloAutoPlay); // limpiar si el componente se destruye
  }

  obtenerDatos() {
    this.matchService.listar().subscribe({
      next: (data) => {
        this.partidos = data;
        this.iniciarAutoPlay(); // ⏱️ Inicia auto-play cuando se cargan
      },
      error: (err) => console.error(err)
    });

    this.teamService.listar().subscribe({
      next: (data) => this.equipos = data,
      error: (err) => console.error(err)
    });
  }

  obtenerEntrenador(nombre: string): string {
    const equipo = this.equipos.find(eq => eq.nombre === nombre);
    return equipo?.entrenador ?? 'Técnico no definido';
  }

  obtenerEscudo(nombre: string): string {
    const equipo = this.equipos.find(eq => eq.nombre === nombre);
    return equipo?.escudoUrl ?? '';
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.partidos.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.partidos.length) % this.partidos.length;
  }

  iniciarAutoPlay(): void {
    this.intervaloAutoPlay = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }
}
