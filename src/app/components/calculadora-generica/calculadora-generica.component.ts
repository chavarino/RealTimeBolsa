import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalculadoraInputs, ObjectCustom } from 'src/app/interfaces/data';

@Component({
  selector: 'app-calculadora-generica',
  templateUrl: './calculadora-generica.component.html',
  styleUrls: ['./calculadora-generica.component.scss'],
})
export class CalculadoraGenericaComponent implements OnInit {


  calculadoras : ObjectCustom<CalculadoraInputs> = {}
  @Input()
  lastIndiceValor : number;


  onChangeCalculadoraNormal(calc : CalculadoraInputs)
  {

    this.calculadoras.normal = calc;

    this.eventName.emit(this.calculadoras);
    
  }
  
  onChangeCalculadoraInversa(calc : CalculadoraInputs)
  {
    this.calculadoras.inversa = calc;
    this.eventName.emit(this.calculadoras);
  }

  @Output() eventName = new EventEmitter<ObjectCustom<CalculadoraInputs>>();
  constructor() { }

  ngOnInit() {}

}
