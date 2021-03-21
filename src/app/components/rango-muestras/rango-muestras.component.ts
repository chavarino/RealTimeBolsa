import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalStoreService } from 'src/app/services/local-store.service';
import { GenericAbstractComponent } from '../../clases/GenericAbstractComponent';

@Component({
  selector: 'app-rango-muestras',
  templateUrl: './rango-muestras.component.html',
  styleUrls: ['./rango-muestras.component.scss'],
})
export class RangoMuestrasComponent extends GenericAbstractComponent implements OnInit {

 
  maxNumber : number = 1000;
  minNumber : number = 1;
  numeroMuestrasVistas  :  number = 15;


  @Output() onChangeNumMuestras = new EventEmitter<number>();



  onChangeRange(muestras :number)
  {

    console.log("muestras", muestras)
    this.saveModelFromLocalStorage(muestras);
    this.onChangeNumMuestras.emit(muestras);
  }

  constructor( localData : LocalStoreService ) {


    super("rangoMuestras", localData)
   }

  ngOnInit() {

        this.loadModelFromLocalStorage<number>((values)=>{

     
          this.numeroMuestrasVistas = values;

        
    })

  }

}
