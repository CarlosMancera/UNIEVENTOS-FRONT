import { Injectable } from '@angular/core';
import { AgregarAlCarritoDTO } from '../dto/ordenDTO/AgregarAlCarritoDTO';
import { ResumenCarritoDTO } from '../dto/carritoDTO/ResumenCarritoDTO';
import { InformacionCuentaDTO } from '../dto/cuentaDTO/InformacionCuentaDTO';


@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carritos: ResumenCarritoDTO[] = [];
  private cuenta: InformacionCuentaDTO[]=[];

  constructor() {
    this.carritos = [];
    this.cuenta = [];
  }
}