import { Injectable } from '@angular/core';
import { CrearCuponDTO } from '../dto/cuponDTO/CrearCuponDTO';
import { EditarCuponDTO } from '../dto/cuponDTO/EditarCuponDTO';
import { InformacionCuponDTO } from '../dto/cuponDTO/InformacionCuponDTO';
import { ResumenCuponDTO } from '../dto/cuponDTO/ResumenCuponDTO';



@Injectable({
  providedIn: 'root'
})
export class CuponService {

  private cupones: ResumenCuponDTO[]= [];
  private crear: CrearCuponDTO[];
  private editar: EditarCuponDTO[];
  private info: InformacionCuponDTO[];

  constructor() {
    this.cupones = [];
    this.crear =[];
    this.editar=[];
    this.info=[];
   }

  // Crear un nuevo cupón
  public crearCupon(crearCuponDTO: CrearCuponDTO) {
    this.crear.push(crearCuponDTO);
    };
        
  
    public editarCupon(id:string, editarCuponDTO: EditarCuponDTO){
      const indice = this.editar.findIndex(editar => editar.id == id);
      if (indice !== -1) {
        this.editar[indice] = editarCuponDTO;
      }
      return 'Cupón editado exitosamente';
    }
  
    public eliminarCupon(id: string) {
      this.cupones = this.cupones.filter(cupon => cupon.id !== id);
    }
  
    public obtenerInformacionCupon(id: string):InformacionCuponDTO | undefined {      
      return this.info.find(cupon => cupon.id === id);
      
    }
  
    listarCupones(): ResumenCuponDTO[] {
      return this.cupones;
    }
  
    buscarCuponesPorCodigo(codigo: string): ResumenCuponDTO[] {
      return this.cupones.filter((c) => c.codigo.includes(codigo));
    }

}
