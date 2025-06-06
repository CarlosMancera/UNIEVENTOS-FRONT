import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MensajeDTO } from '../dto/MensajeDTO';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicoService {

  private publicoURL = "https://unieventosbackend-production.up.railway.app/api/publico";


  constructor(private http: HttpClient) { }

  public listarTipos(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.publicoURL}/evento/listar-tipos`);
  }
 
 
  public listarCiudades(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.publicoURL}/evento/obtener-ciudades`);
  }
 
 
  public listarEventos(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.publicoURL}/evento/obtener-todos`);
  }
 
 
  public obtenerEvento(id: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.publicoURL}/evento/obtener/${id}`);
  }
 
}
