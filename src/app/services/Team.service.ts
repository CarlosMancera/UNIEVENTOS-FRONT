import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from '../models/team.model';
import { ENDPOINTS } from '../core/endpoints';
import { HttpClientService } from './HttpClientService.service';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  constructor(private http: HttpClientService) {}

  crear(team: Team): Observable<number> {
    return this.http.post<number>(ENDPOINTS.crearEquipo, team);
  }

  obtener(id: number): Observable<Team> {
    const params = new Map().set('id', id.toString());
    return this.http.get<Team>(ENDPOINTS.obtenerEquipo, params);
  }

  actualizar(id: number, team: Team): Observable<void> {
    const params = new Map().set('id', id.toString());
    return this.http.put<void>(ENDPOINTS.actualizarEquipo, team, params);
  }

  eliminar(id: number): Observable<void> {
    const params = new Map().set('id', id.toString());
    return this.http.delete<void>(ENDPOINTS.eliminarEquipo, params);
  }

  listar(): Observable<Team[]> {
    return this.http.get<Team[]>(ENDPOINTS.listarEquipos);
  }
}
