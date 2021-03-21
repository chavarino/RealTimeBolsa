import { Component } from '@angular/core';

import { LocalStoreService } from 'src/app/services/local-store.service';
import { CalculadoraAbstract } from '../../clases/CalculadoraAbstract';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.scss'],
})
export class CalculadoraComponent extends CalculadoraAbstract {






  
 
  
  constructor( localData : LocalStoreService) {
    super("calc_normal", localData)
 
   }
  
  
  


  


  calcular()
  {
    let precioVenta =  this.calculadora.isPrecioManual ? this.calculadora.precVenta : this.lastIndiceValor;
    this.calculadora.ganancia = (precioVenta/this.calculadora.precCompra - 1) * this.calculadora.dinero;

    return this.calculadora.ganancia
  }

}
