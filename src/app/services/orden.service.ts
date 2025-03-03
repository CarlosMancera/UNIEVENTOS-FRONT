import { Injectable } from '@angular/core';
import { ResumenCuponDTO } from '../dto/cuponDTO/ResumenCuponDTO';
import { OrdenCompraDTO } from '../dto/ordenDTO/OrdenCompraDTO';
import { PagoDTO } from '../dto/ordenDTO/PagoDTO';
import { ResumenCarritoDTO } from '../dto/carritoDTO/ResumenCarritoDTO';
import { ResumenOrdenDTO } from '../dto/ordenDTO/ResumenOrdenDTO';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  ordenes:OrdenCompraDTO[]= [];

  constructor() { 
    this.ordenes = [];
  }

  public realizarPago(idOrden: string): String {
      return 'Pago realizado exitosamente';
  }

  public aplicarDescuento(idCuenta: string, codigoDescuento: string): ResumenOrdenDTO {
    const orden = this.ordenes.find(o => o.id === idCuenta);
    if (orden) {
      // Aplicar descuento y devolver la orden actualizada
      return { ...orden, descuento: 10, total: orden.subtotal - 10 };
    } else {
      throw new Error('Orden no encontrada');
    }
  }

  public generarOrdenCompra(idCuenta: string): OrdenCompraDTO {   
    const nuevaOrden: OrdenCompraDTO = {
      id: 'nuevoId', // Generar un ID único
      fechaCreacion: new Date(),
      entradas: [],
      subtotal: 100,
      descuento: 0,
      total: 100
    };
    this.ordenes.push(nuevaOrden);
    return nuevaOrden;
  }

  confirmarPago(idOrden: string, codigoConfirmacion: string): void {
    console.log(`Confirmando pago para la orden ${idOrden} con código ${codigoConfirmacion}`);
}

buscarCuponesUtilizadosPorUsuario(idUsuario: string): ResumenCuponDTO[] {
    const cupones: ResumenCuponDTO[] = [];
    return cupones;
}

recibirNotificacionMercadoPago(request: Map<string, Object>): void {
    console.log('Recibida notificación de Mercado Pago:', request);
}
   
}
