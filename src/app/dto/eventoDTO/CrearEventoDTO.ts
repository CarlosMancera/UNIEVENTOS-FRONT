import { LocalidadEventoDTO } from "./LocalidadEventoDTO"

export interface CrearEventoDTO{
        
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