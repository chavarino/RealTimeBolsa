import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { CalculadoraAbstract } from 'src/app/clases/CalculadoraAbstract';
import { CalculadoraInputs } from 'src/app/interfaces/data';
import { LocalStoreService } from 'src/app/services/local-store.service';

@Component({
  selector: 'app-calculadora-inversa',
  templateUrl: './calculadora-inversa.component.html',
  styleUrls: ['./calculadora-inversa.component.scss'],
})
export class CalculadoraInversaComponent extends CalculadoraAbstract {

  
  constructor(localData : LocalStoreService,public toastController: ToastController) {
    super("calc_inver", localData);
  }




  async openQuestion()
  {
    const toast = await this.toastController.create({
      header: 'Como funciona',
      message: 'Esta calculadora, introduciendo la cantidad de dinero que se quiere obtener y dependiendo del modo, calcula el precio de compra/venta.\n',
      position: 'middle',
      buttons: [
         {
          text: 'Aceptar',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();

  }



  calcular()
  {

    let constante = (this.calculadora.ganancia/this.calculadora.dinero + 1);
    let valor;
    
    if(!this.calculadora.isInverso)
    {

      valor = this.calculadora.isPrecioManual ? this.calculadora.precCompra : this.lastIndiceValor;
      this.calculadora.precVenta =  valor * constante
        
      return this.calculadora.precVenta;
      
    }
    else{
        valor = this.calculadora.isPrecioManual ? this.calculadora.precVenta : this.lastIndiceValor;
        this.calculadora.precCompra =  valor / constante
        return this.calculadora.precCompra;
    }

   

  }

}
