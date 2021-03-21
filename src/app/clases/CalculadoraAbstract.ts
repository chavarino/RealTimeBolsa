import { EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { CalculadoraInputs } from "../interfaces/data";
import { LocalStoreService } from "../services/local-store.service";
import { GenericAbstractComponent } from "./GenericAbstractComponent";

export abstract class CalculadoraAbstract  extends GenericAbstractComponent implements OnInit  {

    @ViewChild('f') f;


    @Input()
    lastIndiceValor : number;
  
  
    @Output() modelChange = new EventEmitter<CalculadoraInputs>();
    calculadora : CalculadoraInputs = {

        dinero : 0,
        precCompra : 0,
        precVenta : 0,
        isPrecioManual : false,
        ganancia: 0,
        isLoaded : false
        
      }
    
    constructor( id:string, localData : LocalStoreService)
    {
        super(id, localData);
    }

    private isLoaded = false;

    


      modelChanged(change : CalculadoraInputs)
      {
        if(!this.isLoaded)
        {
            return;
        }
        console.log(change);
        this.calculadora = change;
        this.calcular();
        this.saveModelFromLocalStorage(this.calculadora);
        this.modelChange.emit(this.calculadora);
      }


      abstract calcular();

      ngAfterViewInit() {
    
        this.f.form.valueChanges.subscribe((change : CalculadoraInputs) => {
    
          this.modelChanged(change);
        });

        
      }
      
      ngOnInit() {
        
        this.loadModelFromLocalStorage((value: CalculadoraInputs) => {
        
            this.calculadora = value;
        
          this.isLoaded=true;
        });
    
        
      }


}