import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgregarDeseoDTO } from '../dto/deseoDTO/AgregarDeseoDTO';
import { ResumenDeseoDTO } from '../dto/deseoDTO/ResumenDeseoDTO';

@Injectable({
  providedIn: 'root'
})
export class DeseoService {
  deseos: ResumenDeseoDTO[] = [];

  constructor() { 
    this.deseos = [];    
  }
  public agregarDeseo(AgregarDeseoDTO:ResumenDeseoDTO){
    this.deseos.push( AgregarDeseoDTO);
  }

  public eliminarDeseo(id: string): void {
    this.deseos = this.deseos.filter(deseo => deseo.id !== id);
  }

  listarDeseos(): ResumenDeseoDTO [] {
    return this.deseos;
  }

  public buscarDeseosPorNombre(nombreEvento: string): ResumenDeseoDTO[] {
    return this.deseos.filter(deseo => deseo.nombreEvento.includes(nombreEvento));
  }

  enviarNotificaciones(): void {
    console.log('Enviando notificaciones...');
  }
}



