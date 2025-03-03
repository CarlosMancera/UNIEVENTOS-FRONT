import { Injectable } from '@angular/core';
import { InformacionArtistaDTO } from '../dto/artistasDTO/InformacionArtistaDTO';
import { CrearArtistaDTO } from '../dto/artistasDTO/CrearArtistaDTO'; 
import { EditarArtistaDTO } from '../dto/artistasDTO/EditarArtistaDTO'; 


@Injectable({
  providedIn: 'root'
})
export class ArtistaService {

  artistas: InformacionArtistaDTO[];

  constructor() {
    this.artistas = [];
  }

  public listarArtistas(): InformacionArtistaDTO[] {
    return this.artistas;
  }

  public buscarArtistasPorNombre(nombre: string): InformacionArtistaDTO[] {
    return this.artistas.filter(artista => 
      artista.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
  }

  public obtenerInformacionArtista(id: string): InformacionArtistaDTO | undefined {
    return this.artistas.find(artista => artista.id === id);
  }

  public crearArtista(crearArtistaDTO: CrearArtistaDTO): string {
    const nuevoArtista = {...crearArtistaDTO} as InformacionArtistaDTO;
    this.artistas.push(nuevoArtista);
    return nuevoArtista.id;
  }

  public eliminarArtista(id: string): string {
    this.artistas = this.artistas.filter(artista => artista.id !== id);
    return id;
  }

  public editarArtista(editarArtistaDTO: EditarArtistaDTO): string {
    const indice = this.artistas.findIndex(artista => artista.id === editarArtistaDTO.id);
    if (indice !== -1) {
      this.artistas[indice] = {...this.artistas[indice], ...editarArtistaDTO};
      return editarArtistaDTO.id;
    }
    throw new Error('Artista no encontrado');
  }

}