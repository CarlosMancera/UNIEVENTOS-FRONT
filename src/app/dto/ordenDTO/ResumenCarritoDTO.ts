import { LocalidadEventoDTO } from "../eventoDTO/LocalidadEventoDTO"

export interface ResumenCarritoDTO{

        nombreEvento: string,
        fechaEvento: Date,
        localidades: LocalidadEventoDTO[],
        cantidad: number,
        precioUnitario: number

}
