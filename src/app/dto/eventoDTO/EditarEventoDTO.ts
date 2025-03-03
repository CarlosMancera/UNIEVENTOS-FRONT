import { LocalidadEventoDTO } from "./LocalidadEventoDTO"

export interface EditarEventoDTO{
        id: string,       
        nombre: string,       
        artista: string,        
        descripcion: string,        
        fecha: Date,       
        direccion: string,       
        ciudad: string,
        tipoEvento: string,
        localidades: LocalidadEventoDTO[]
}