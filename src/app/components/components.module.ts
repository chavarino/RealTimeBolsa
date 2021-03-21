import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculadoraComponent } from './calculadora/calculadora.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CalculadoraGenericaComponent } from './calculadora-generica/calculadora-generica.component';
import { CalculadoraInversaComponent } from './calculadora-inversa/calculadora-inversa.component';
import { RangoMuestrasComponent } from './rango-muestras/rango-muestras.component';
import { LimitesAlertaComponent } from './limites-alerta/limites-alerta.component';



@NgModule({
  declarations: [CalculadoraComponent, CalculadoraGenericaComponent, CalculadoraInversaComponent, RangoMuestrasComponent, LimitesAlertaComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [CalculadoraGenericaComponent, RangoMuestrasComponent, LimitesAlertaComponent]
})
export class ComponentsModule { }
