// match-crear.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Match } from '../../../models/match.model';
import { Section } from '../../../models/section.model';
import { Team } from '../../../models/team.model';
import { ImagenService } from '../../../services/ImagenService.service';
import { MatchService } from '../../../services/match.service';
import { SectionService } from '../../../services/section.service';
import { TeamService } from '../../../services/Team.service';

@Component({
  selector: 'app-match-crear',
  standalone: true,
  templateUrl: './match-crear.component.html',
  styleUrls: ['./match-crear.component.css'],
  imports: [CommonModule, FormsModule]
})
export class MatchCrearComponent implements OnInit {
  match: Match = {
    equipoLocal: '',
    equipoVisitante: '',
    fechaHora: '',
    estado: 'PROGRAMADO',
    tipoEvento: '',
    imagenPortada: '',
    descripcion: ''
  };

  equipos: Team[] = [];
  secciones: Section[] = [];
  nuevaSeccion: Partial<Section> = { nombre: '', capacidadTotal: 0, precio: 0 };
  imagenSeleccionada?: File;

  constructor(
    private matchService: MatchService,
    private imagenService: ImagenService,
    private teamService: TeamService,
    private sectionService: SectionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.teamService.listar().subscribe(data => this.equipos = data);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.matchService.obtener(+id).subscribe(data => {
        this.match = data;
        this.sectionService.listarPorMatch(+id).subscribe(sec => this.secciones = sec);
      });
    }
  }

  onFileChange(event: any): void {
    this.imagenSeleccionada = event.target.files[0];
  }

  guardarTodo(): void {
    if (this.imagenSeleccionada) {
      this.imagenService.subirImagen(this.imagenSeleccionada).subscribe({
        next: (url: string) => {
          this.match.imagenPortada = url;
          this.guardarPartido();
        },
        error: () => alert('Error al subir imagen')
      });
    } else {
      this.guardarPartido();
    }
  }

  guardarPartido(): void {
    if (this.match.id) {
      this.matchService.actualizar(this.match.id, this.match).subscribe(() => {
        alert('Partido actualizado');
        this.router.navigate(['/admin/partido-admin']);
      });
    } else {
      this.matchService.crear(this.match).subscribe((id) => {
        alert('Partido creado');
        this.router.navigate(['/admin/editar-partido', id]);
      });
    }
  }

  agregarSeccion(): void {
    if (!this.match.id) return alert('Primero guarda el partido');

    const sectionToSave: Section = {
      matchId: this.match.id!,
      nombre: this.nuevaSeccion.nombre!,
      capacidadTotal: this.nuevaSeccion.capacidadTotal!,
      precio: this.nuevaSeccion.precio!
    };

    this.sectionService.crear(sectionToSave).subscribe((id) => {
      this.secciones.push({ ...sectionToSave, id });
      this.nuevaSeccion = { nombre: '', capacidadTotal: 0, precio: 0 };
    });

  }

  eliminarSeccion(id: number): void {
    this.sectionService.eliminar(id).subscribe(() => {
      this.secciones = this.secciones.filter(s => s.id !== id);
    });
  }


  getEscudo(nombre: string | null | undefined): string | undefined {
    return this.equipos.find(e => e.nombre === nombre)?.escudoUrl;
  }

  volver(): void {
    this.router.navigate(['/admin/partido-admin']);
  }
}
