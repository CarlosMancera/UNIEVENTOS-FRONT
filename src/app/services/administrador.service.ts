import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MensajeDTO } from '../dto/MensajeDTO';
import { Observable } from 'rxjs';
import { CrearEventoDTO } from '../dto/eventoDTO/CrearEventoDTO';
import { EditarEventoDTO } from '../dto/eventoDTO/EditarEventoDTO';
import { FiltroEventoDTO } from '../dto/eventoDTO/FiltroEventoDTO';
import { InformacionArtistaDTO } from '../dto/artistasDTO/InformacionArtistaDTO';
import { ResumenEventoDTO } from '../dto/eventoDTO/ResumenEventoDTO';
import { InformacionEventoDTO } from '../dto/eventoDTO/InformacionEventoDTO';
import { ItemEventoDTO } from '../dto/eventoDTO/ItemEventoDTO';
import { ResumenCuponDTO } from '../dto/cuponDTO/ResumenCuponDTO';
import { CrearCuponDTO } from '../dto/cuponDTO/CrearCuponDTO';
import { EditarArtistaDTO } from '../dto/artistasDTO/EditarArtistaDTO';
import { CrearArtistaDTO } from '../dto/artistasDTO/CrearArtistaDTO';
import { EditarCuponDTO } from '../dto/cuponDTO/EditarCuponDTO';
import { InformacionCuponDTO } from '../dto/cuponDTO/InformacionCuponDTO';


@Injectable({
  providedIn: 'root'
})
export class AdministradorService {

  private adminURL = "http://localhost:8081/api/administrador";


  constructor(private http: HttpClient) { }



  // Métodos para eventos
  public crearEvento(crearEventoDTO: CrearEventoDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.adminURL}/crear-evento`, crearEventoDTO);
  }

  public editarEvento(editarEventoDTO: EditarEventoDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.adminURL}/editar-evento`, editarEventoDTO);
  }

  public eliminarEvento(id: string): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.adminURL}/eliminar-evento/${id}`);
  }

  public obtenerInformacionEvento(id: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.adminURL}/obtener-info-evento/${id}`);
  }

  public listarEventos(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.adminURL}/listar`);
  }

  public filtrarEventos(filtroDTO: FiltroEventoDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.adminURL}/filtrar`, filtroDTO);
  }

  public cambiarEstadoEvento(id: string, nuevoEstado: string): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.adminURL}/cambiar-estado/${id}`, null, {
      params: { nuevoEstado: nuevoEstado }
    });
  }

  public buscarEventosPorNombre(nombre: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.adminURL}/buscar-evento/${nombre}`);
  }

  
  public agregarImagenEvento(imagen: FormData): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.adminURL}/agregar-imagen-evento`, imagen);
  }
 

  public agregarImagenLocalidad(idEvento: string, nombreLocalidad: string, imagen: FormData): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.adminURL}/agregar-imagen-localidad/${idEvento}/${nombreLocalidad}`, imagen);
  }

  public generarReporteVentasHTML(idEvento: string): Observable<Blob> {
    return this.http.get(`${this.adminURL}/reporte-ventas-html/${idEvento}`, { responseType: 'blob' });
  }

  public generarReporteVentasPDF(idEvento: string): Observable<Blob> {
    return this.http.get(`${this.adminURL}/reporte-ventas-pdf/${idEvento}`, { responseType: 'blob' });
  }

  public generarReporteVentasXML(idEvento: string): Observable<Blob> {
    return this.http.get(`${this.adminURL}/reporte-ventas-xml/${idEvento}`, { responseType: 'blob' });
  }

  // Métodos para artistas
  public listarArtistas(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.adminURL}/listar-artista`);
  }

  public buscarArtistasPorNombre(nombre: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.adminURL}/buscar-artista/${nombre}`);
  }

  public obtenerInformacionArtista(id: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.adminURL}/obtener-artista/${id}`);
  }

  public eliminarArtista(id: string): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.adminURL}/eliminar-artista/${id}`);
  }

  public editarArtista(artista: EditarArtistaDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.adminURL}/editar-artista`, artista);
  }

  public crearArtista(artista: CrearArtistaDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.adminURL}/crear-artista`, artista);
  }

  // Métodos para cupones
  public crearCupon(cuponDTO: CrearCuponDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.adminURL}/crear-cupon`, cuponDTO);
  }

  public editarCupon(cuponDTO: EditarCuponDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.adminURL}/editar-cupon`, cuponDTO);
  }

  public eliminarCupon(id: string): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.adminURL}/eliminar-cupon/${id}`);
  }

  public obtenerInformacionCupon(id: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.adminURL}/obtener-cupon/${id}`);
  }

  public listarCupones(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.adminURL}/listar-cupon`);
  }

  public buscarCuponesPorCodigo(codigo: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.adminURL}/buscar-cupon/${codigo}`);
  }

  // Métodos para imágenes
  public subirImagen(imagen: FormData): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.adminURL}/subir-imagen`, imagen);
  }

  public eliminarImagen(nombreImagen: string): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.adminURL}/eliminar-imagen/${nombreImagen}`);
  }
 
}
