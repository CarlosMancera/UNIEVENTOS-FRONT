import { LocalidadEventoDTO } from "../eventoDTO/LocalidadEventoDTO"

export interface AgregarAlCarritoDTO{
        idCuenta:string,
        idEvento: string,
        localidad: string,
        cantidad: number,
        idEntrada: string

}
