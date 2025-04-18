// match-admin.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Match } from '../../../models/match.model';
import { MatchService } from '../../../services/match.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-match-admin',
  standalone: true,
  templateUrl: './match-admin.component.html',
  styleUrls: ['./match-admin.component.css'],
  imports: [CommonModule]
})
export class MatchAdminComponent implements OnInit {
  partidos: Match[] = [];

  constructor(
    private matchService: MatchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPartidos();
  }

  cargarPartidos(): void {
    this.matchService.listar().subscribe(data => this.partidos = data);
  }

  editar(id: number): void {
    this.router.navigate(['/admin/editar-partido', id]);
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar este partido?')) {
      this.matchService.eliminar(id).subscribe(() => {
        this.cargarPartidos();
        alert('Partido eliminado correctamente');
      });
    }
  }

  crear(): void {
    this.router.navigate(['/admin/crear-partido']);
  }
}
