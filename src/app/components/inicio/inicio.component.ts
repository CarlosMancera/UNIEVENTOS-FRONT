import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PublicoService } from '../../services/publico.service';
import { EventoDTO } from '../../dto/eventoDTO/evento-dto';



@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  eventos: EventoDTO[] = [];

  currentSlide = 0;

  constructor(private publicoService: PublicoService) {
    this.eventos = [];
    this.obtenerEventos();
  
 }
 
 public obtenerEventos(){
  this.publicoService.listarEventos().subscribe({
    next: (data) => {
      this.eventos = data.respuesta;
    },
    error: (error) => {
      console.error(error);
    },
  });
 }
 

 
  
}

