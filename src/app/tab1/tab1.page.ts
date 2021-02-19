import { Component, OnInit } from '@angular/core';
import Highcharts, { DataLabelsOptions, PointLabelObject, PointOptionsObject, Series } from 'highcharts';
import { SoundClass } from '../clases/sound';
import { Alerta, IndiceInfo, IndiceValor, Senial } from '../interfaces/data';
// import Highcharts from 'highcharts/highstock';
import { RealDataService } from '../services/real-data.service';
1
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  filtros = {
    soloRelevantes : false
  }
  elementsNumber  :  number = 15;
    listaSenialesView : Array<Senial> = [];
    listaSeniales : Array<Senial> = []; 
    listaHistorico : Array<IndiceValor> = [];
    lastIndiceValor: IndiceValor = {

      bollingBands : {}
    } as IndiceValor;
    precio : number[] = [];
    hora : string[] = [];
    bbUpper : number[] = [];
    bbLower : number[] = [];
    bbMiddle : number[] = [];
    serie : PointOptionsObject[];



    indicesInfo :Map<string, IndiceInfo> = new Map<string, IndiceInfo>();

  constructor(private rDService : RealDataService) {
    this.indicesInfo.set("iag", {
      nombre : "IAG",
      id: 13809
    })

  }


  

  limites = {

    superior : 99999,
    inferior : 0
  }
  alertaSeniales = {
    compra:  {
      sonido: SoundClass.crearBip("/assets/sounds/senial_compra.mp3"),
      habilitado : true
    },
    venta: {
      sonido: SoundClass.crearBip("/assets/sounds/senial_venta.mp3"),
      habilitado : true
    },
    limSuperior : {
      sonido: SoundClass.crearBip("/assets/sounds/alarma_limite.mp3"),
      habilitado : true
    },
    limInferior : {
      sonido: SoundClass.crearBip("/assets/sounds/alarma_limite.mp3"),
      habilitado : true
    }
  }
  fnToPointOptionsObject(x, y){
    let res : PointOptionsObject =  {
      x : x,
      y : y,
      dataLabels : {
        enabled : true,
        formatter : function (this: PointLabelObject, options: DataLabelsOptions) {

           console.log("FORMATER" , this, options)
          return this.y + "PELO"

        }
      }
    }

    return res;
}
 ngOnInit(): void {


   this.crearHighCharts();

   this.rDService.getRealTimeData(this.indicesInfo.get("iag").id).subscribe(o=>{
        
        this.listaHistorico.push(o);
        this.lastIndiceValor = o;
        this.precio.push(o.last_numeric);

        this.hora.push(o.time);

        this.bbUpper.push(o.bollingBands.upper)
        this.bbMiddle.push(o.bollingBands.middle);
        this.bbLower.push(o.bollingBands.lower);

        this.isSuperadosLimites();
        this.getSenial();
        
        this.doFilters();
        console.log("siguiente valor", o);
        this.crearHighCharts();
   })
   
 }

 switchHabilitado(alerta :Alerta, habilitado ?:boolean)
 {

  alerta.habilitado = habilitado !== undefined ? habilitado :  !alerta.habilitado;
 }
 getLastSeries<T>(array : T[]) : T[]
 {
    return array.slice(Math.max(0, array.length-this.elementsNumber), array.length)


 }


playAlertaSeniales(alerta : Alerta)
{

  if(alerta.habilitado)
  {

    alerta.sonido.play()
  }

}

getNewSenial(indice :string, estrategia : string, info:string, accion :string, colorSenial : string, background : string, isSenialRelevante : boolean) : Senial
{
  let max = parseFloat(this.lastIndiceValor.high);
  let min = parseFloat(this.lastIndiceValor.low);
    return {
      valorMaxActual: max,
      valorMinActual: min,
      isMax: this.lastIndiceValor.last_numeric > max,
      isMin: this.lastIndiceValor.last_numeric < min,
      indice: indice,
      estrategia: estrategia,
        //indiceValor: this.lastIndiceValor,
        info : info,
        accion: accion,
        colorSenial: colorSenial,
        hora : this.lastIndiceValor.time,
        valorActual:this.lastIndiceValor.last_numeric,
        colorTendencia : this.lastIndiceValor.last_dir === "redBg" ? "red" : "green",
        tipoArrow : this.lastIndiceValor.last_dir === "redBg" ? "arrow-down" : "arrow-up",  
        background : background,
        isSenialRelevante: isSenialRelevante
    } ;
}
isSuperadosLimites()
{ 

 
  let senial : Senial;
  if(this.alertaSeniales.limInferior.habilitado && this.limites.inferior !== undefined && this.limites.inferior> this.lastIndiceValor.last_numeric)
  {
    senial  = this.getNewSenial(this.indicesInfo.get("iag").nombre, "Limite Inferior",
    `ALERTA LIM. Inferior ` + (parseFloat(this.lastIndiceValor.low) > this.limites.inferior ? "(Mínimo)" : ""), "-", "orange", "orange", true);
    
    /*
    {
      
      estrategia: "Limite Inferior",
      //indiceValor: this.lastIndiceValor,
      info : `ALERTA LIM.INFERIOR ` + (parseFloat(this.lastIndiceValor.low) > this.limites.inferior ? "(MíNIMO)" : ""),
      accion: "-",
      colorSenial: "orange",
      hora : this.lastIndiceValor.time,
      valorActual:this.lastIndiceValor.last_numeric,
      colorTendencia : this.lastIndiceValor.last_dir === "redBg" ? "red" : "green",
      tipoArrow : this.lastIndiceValor.last_dir === "redBg" ? "arrow-down-outline" : "arrow-up-outline",  
      background : "orange",
      isSenialRelevante: true
    }*/

    this.listaSeniales.unshift(senial);

    this.playAlertaSeniales(this.alertaSeniales.limInferior)

  }
  
  if (this.alertaSeniales.limSuperior.habilitado && this.limites.superior !== undefined && this.limites.superior< this.lastIndiceValor.last_numeric){


    senial  = this.getNewSenial(this.indicesInfo.get("iag").nombre, "Limite Superior",
    `ALERTA LIM. SUPERIOR ` + (parseFloat(this.lastIndiceValor.high) < this.limites.superior ? "(MÁXIMO)" : ""), "-", "orange", "orange", true);
    this.playAlertaSeniales(this.alertaSeniales.limSuperior)
    this.listaSeniales.unshift(senial);
  }


}

doFilters()
{

      this.listaSenialesView = this.listaSeniales.filter((v)=>{
        return  !this.filtros.soloRelevantes || v.isSenialRelevante ===this.filtros.soloRelevantes;
      })
}

getSenial()
{
  let accion = "NS";
  let color = "yellow";
  let isSenialRelevante = false;
  if(this.lastIndiceValor.rsi >=70 && this.lastIndiceValor.bollingBands.pb>1)
  {
      accion = "VENDE";
      color  = "red"

      this.playAlertaSeniales(this.alertaSeniales.compra)
      isSenialRelevante = true;
   
  }
  else if(this.lastIndiceValor.rsi <=30 && this.lastIndiceValor.bollingBands.pb<0)
  {

    accion = "COMPRA";
    color = "green"
    this.playAlertaSeniales(this.alertaSeniales.venta)
    isSenialRelevante = true;
  }
  
    let max = parseFloat(this.lastIndiceValor.high);
    let min = parseFloat(this.lastIndiceValor.low);
    let senial : Senial =  this.getNewSenial(this.indicesInfo.get("iag").nombre, "BB - RSI",
    `PB: ${this.lastIndiceValor.bollingBands.pb.toFixed(2)} - RSI: ${this.lastIndiceValor.rsi.toFixed(2)}`, accion, color, "purple", isSenialRelevante);
    
    
    /*{
      indice : "IAG",
      estrategia: "BB - RSI",
      //indiceValor: this.lastIndiceValor,
      info : `PB: ${this.lastIndiceValor.bollingBands.pb.toFixed(2)} - RSI: ${this.lastIndiceValor.rsi.toFixed(2)}`,
      accion:accion,
      colorSenial:color,
      hora : this.lastIndiceValor.time,
      valorActual:this.lastIndiceValor.last_numeric,
      colorTendencia : this.lastIndiceValor.last_dir === "redBg" ? "red" : "green",
      tipoArrow : this.lastIndiceValor.last_dir === "redBg" ? "arrow-down-outline" : "arrow-up-outline",  
      background : "purple" ,
      isSenialRelevante :isSenialRelevante,
      valorMaxActual : max,
      valorMinActual : min,
      isMax : this.lastIndiceValor.last_numeric > max,
      isMin : this.lastIndiceValor.last_numeric < min


      
    }*/

    this.listaSeniales.unshift(senial);
}

 crearHighCharts()
 {

  let fnToPointOptionsObject = (x, y)=> {
      let res : PointOptionsObject =  {
        x : x,
        y : y,
        dataLabels : {
          enabled : true,
          formatter : function (this: PointLabelObject, options: DataLabelsOptions) {

             console.log("FORMATER" , this, options)
            return this.y + "PELO"

          }
        }
      }

      return res;
  }

  
  Highcharts.chart('container', {

                title: {
                    text: 'Datos de bolsa y calculo de estrategias en tiempo real'
                },

                subtitle: {
                    text: ' Indice: IAG'
                },
            
                yAxis: {
                    title: {
                        text: 'Precio'
                    },
                    allowDecimals: true,
                    zoomEnabled: true

                    
                    //categories: this.precio//['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    
                },
                
                xAxis: {
                    accessibility: {
                        rangeDescription: 'Range: 2010 to 2017'
                    },
                    categories :this.getLastSeries(this.hora)
                    
                },

               /* legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },*/

                plotOptions: {
                    series: {
                        
                        label: {
                            connectorAllowed: false
                        }
                    }
                },
                series: [{
                    name: 'Precio',
                    data: this.getLastSeries(this.precio),//[fnToPointOptionsObject(43934,1), fnToPointOptionsObject(52503,2), fnToPointOptionsObject(57177,3), fnToPointOptionsObject(69658,4), fnToPointOptionsObject(97031,5), fnToPointOptionsObject(119931, 6), fnToPointOptionsObject(137133, 7), fnToPointOptionsObject(154175, 8)],
                      type: "line"
                },
                {
                    name: 'BB UPPER',
                    data: this.getLastSeries(this.bbUpper),//[fnToPointOptionsObject(43934,1), fnToPointOptionsObject(52503,2), fnToPointOptionsObject(57177,3), fnToPointOptionsObject(69658,4), fnToPointOptionsObject(97031,5), fnToPointOptionsObject(119931, 6), fnToPointOptionsObject(137133, 7), fnToPointOptionsObject(154175, 8)],
                      type: "line",
                },
                {
                    name: 'BB. Lower',
                    data: this.getLastSeries(this.bbLower),//[fnToPointOptionsObject(43934,1), fnToPointOptionsObject(52503,2), fnToPointOptionsObject(57177,3), fnToPointOptionsObject(69658,4), fnToPointOptionsObject(97031,5), fnToPointOptionsObject(119931, 6), fnToPointOptionsObject(137133, 7), fnToPointOptionsObject(154175, 8)],
                      type: "line",
                },
                {
                    name: 'bb. Middle',
                    data: this.getLastSeries(this.bbMiddle),//[fnToPointOptionsObject(43934,1), fnToPointOptionsObject(52503,2), fnToPointOptionsObject(57177,3), fnToPointOptionsObject(69658,4), fnToPointOptionsObject(97031,5), fnToPointOptionsObject(119931, 6), fnToPointOptionsObject(137133, 7), fnToPointOptionsObject(154175, 8)],
                      type: "line",
                }

                      /*dataLabels : {
                        enabled : true,
                        formatter : function (this: PointLabelObject, options: DataLabelsOptions) {
              
                           console.log("FORMATER" , this, options)
                          return this.y + "PELO"
              
                        }
                      },
                      label : {
                        enabled :true,
                        formatter : function(this:Series)
                        {
                          console.log("FORMATER 3" , this)
                          return "pelipuerco";
                        }
                      }*/
               /* }, {
                    name: 'Manufacturing',
                    data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434],
                    type: "line"
                }, {
                    name: 'Sales & Distribution',
                    data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387],
                    type: "line"
                }, {
                    name: 'Project Development',
                    data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227],
                    type: "line"
                }, {
                    name: 'Other',
                    data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111],
                    type: "line"
                }*/],

                /*responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 1000
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }*/

            }, undefined);
 }
}
