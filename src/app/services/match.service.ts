import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Match } from '../models/match.model';
import { ENDPOINTS } from '../core/endpoints';
import { HttpClientService } from './HttpClientService.service';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  constructor(private http: HttpClientService) {}

  crear(match: Match): Observable<number> {
    return this.http.post<number>(ENDPOINTS.crearMatch, match);
  }

  obtener(id: number): Observable<Match> {
    const params = new Map<string, string>().set('id', id.toString());
    return this.http.get<Match>(ENDPOINTS.obtenerMatch, params);
  }

  actualizar(id: number, match: Match): Observable<void> {
    const params = new Map<string, string>().set('id', id.toString());
    return this.http.put<void>(ENDPOINTS.actualizarMatch, match, params);
  }

  eliminar(id: number): Observable<void> {
    const params = new Map<string, string>().set('id', id.toString());
    return this.http.delete<void>(ENDPOINTS.eliminarMatch, params);
  }

  listar(): Observable<Match[]> {
    return this.http.get<Match[]>(ENDPOINTS.listarMatch);
  }
}
