import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocalStoreService } from 'src/app/services/local-store.service';
import { Limite, ObjectCustom, TipoLimite } from '../../interfaces/data';
import { GenericAbstractComponent } from '../../clases/GenericAbstractComponent';

@Component({
  selector: 'app-limites-alerta',
  templateUrl: './limites-alerta.component.html',
  styleUrls: ['./limites-alerta.component.scss'],
})
export class LimitesAlertaComponent extends GenericAbstractComponent implements OnInit {

  static ids = 1;
  constructor(localData : LocalStoreService) { 

    super("limites"+(LimitesAlertaComponent.ids++), localData)
  }

  @Input() get label(): string { return this.limite.label }

  set label(label: string) {
    this.limite.label = label;
  }



  @Input() get tipo(): TipoLimite { return this.limite.tipo }

  set tipo(tipo: TipoLimite) {
    this.limite.tipo = tipo;
  }

  @Input() 
  get valorPredet(): number { return this.valorPredet }

  set valorPredet(valorPredet: number) {
    this.limite.valor = this.limite.valor || valorPredet;
  }


  limite : Limite = {
    habilitado : false,
    tipo : TipoLimite.SUPERIOR,
    valor : 0,
    label:""
  }



  @Output() modelChange = new EventEmitter< Limite>();

  ngOnInit() {
    this.loadModelFromLocalStorage<Limite>((values)=>{
   
      this.limite = values;
      this.changeLimites();

    
  })


  }


  switchHabilitado( )
  {


      this.limite.habilitado= !this.limite.habilitado;
      this.changeLimites();

  }

  changeLimites()
  {

    setTimeout(()=>{
            this.saveModelFromLocalStorage(this.limite);
            this.modelChange.emit(this.limite);
    }, 200)

  }

}
