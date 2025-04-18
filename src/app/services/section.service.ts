import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Section } from '../models/section.model';
import { ENDPOINTS } from '../core/endpoints';
import { HttpClientService } from './HttpClientService.service';

@Injectable({ providedIn: 'root' })
export class SectionService {

  constructor(private http: HttpClientService) {}

  crear(section: Section): Observable<number> {
    return this.http.post<number>(ENDPOINTS.crearSection, section);
  }

  actualizar(id: number, section: Section): Observable<void> {
    const pathParams = new Map<string, string>().set('id', id.toString());
    return this.http.put<void>(ENDPOINTS.actualizarSection, section, pathParams);
  }

  eliminar(id: number): Observable<void> {
    const pathParams = new Map<string, string>().set('id', id.toString());
    return this.http.delete<void>(ENDPOINTS.eliminarSection, pathParams);
  }

  obtener(id: number): Observable<Section> {
    const pathParams = new Map<string, string>().set('id', id.toString());
    return this.http.get<Section>(ENDPOINTS.obtenerSection, pathParams);
  }

  listarPorMatch(matchId: number): Observable<Section[]> {
    const pathParams = new Map<string, string>().set('matchId', matchId.toString());
    return this.http.get<Section[]>(ENDPOINTS.listarSectionsPorMatch, pathParams);
  }
}
