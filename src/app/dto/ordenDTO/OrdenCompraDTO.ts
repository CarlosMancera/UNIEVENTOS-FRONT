import { ResumenCarritoDTO } from "./ResumenCarritoDTO"

export interface OrdenCompraDTO {

        id: string,
        fechaCreacion: Date,
        entradas: ResumenCarritoDTO[],
        subtotal: number,
        descuento: number,
        total: number

}
