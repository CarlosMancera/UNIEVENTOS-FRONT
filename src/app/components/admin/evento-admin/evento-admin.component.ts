import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { EventosService } from '../../../services/eventos.service';
import { EventoDTO } from '../../../dto/eventoDTO/evento-dto';

@Component({
  selector: 'app-evento-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, RouterModule],
  templateUrl: './evento-admin.component.html',
  styleUrls: ['./evento-admin.component.css']
})
export class EventoAdminComponent {
  eventos : EventoDTO[];

  

 constructor(public eventosService:EventosService) {
  this.eventos = eventosService.listar();
}

    
}