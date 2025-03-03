import { LocalidadEventoDTO } from "./LocalidadEventoDTO"

export interface InformacionEventoDTO{       
        

        id: string,
        nombre: string,        
        artista: string,       
        descripcion: string,       
        fecha: Date,        
        direccion: string,        
        ciudad: string,
        tipoEvento: string,
        localidades: LocalidadEventoDTO[],
        imagenPortada:string,
        imagenLocalidades:string,
        estado:string


}