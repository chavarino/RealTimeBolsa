import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { IndiceValor } from '../interfaces/data';
import { TecnicalIndicatorsService } from './tecnical-indicators.service';

@Injectable({
  providedIn: 'root'
})
export class RealDataService {


  private idSocket =1;
  


  private isMock : boolean = false;
 
  constructor(private httpclient : HttpClient, private tIndicat : TecnicalIndicatorsService) {



      
    
   }



  private webSocketMock(): Observable<IndiceValor>
  {

    
    let dataMock: IndiceValor[] ;
    this.httpclient.get<IndiceValor[]>("/assets/data/IntradayHistdata-13809-2021-02-16.json").toPromise().then((res)=>{
      dataMock = res

  })

    return new Observable<IndiceValor>((s)=>{

          setInterval(()=>{
            let lastValueIndex = dataMock.shift();
              lastValueIndex.low = lastValueIndex.low.replace(",", ".");
              lastValueIndex.high = lastValueIndex.high.replace(",", ".");
              s.next(lastValueIndex);

          }, 1500);

    });

  }

  

  getRealTimeData(idIndex : string |number) : Observable<IndiceValor>
  {

    
     if(this.isMock)
      {
          return  this.webSocketMock() ;
      }
      

      this.tIndicat.IniRSIIndicator(idIndex+"",  "rsi", { 
        period : 14,
        values : []
      });
      this.tIndicat.IniBBIndicator(idIndex+"",  "bollingBands", { 
        period : 20,
        values : [],
        stdDev: 2
      });
     
    let url : string = "wss://stream10.forexpros.com/echo/019/vjcge6k3/websocket";
    let vm=this;
      let fnOnOpen:(this: WebSocket, ev: Event) => any =  function(e) {
               
              if(this.readyState === WebSocket.OPEN)
              {
                let a = ['{"_event":"bulk-subscribe","tzID":58,"message":"pid-eu-13809:%%pid-eu-474:%%pid-eu-462:%%pid-eu-959215:%%pid-eu-469:%%pid-eu-446:%%pid-eu-32268:%%pid-eu-473:%%pid-eu-463:%%pid-eu-32180:%%pid-eu-453:%%pid-eu-174:%%pid-eu-8839:%%pid-eu-8874:%%pid-eu-169:%%pid-eu-172:%%pid-eu-8827:%%pid-eu-956731:%%pid-eu-457:%%pid-eu-6408:%%pid-eu-6369:%%pid-eu-28547:%%pidTechSumm-474:%%pidTechSumm-446:%%pidTechSumm-469:%%pidTechSumm-457:%%pidTechSumm-463:%%pidTechSumm-6408:%%pidTechSumm-6369:%%pidExt-eu-13809:%%isOpenExch-11:%%isOpenExch-1:%%isOpenExch-4:%%isOpenExch-1002:%%isOpenPair-8839:%%isOpenPair-8874:%%isOpenPair-8827:%%cmt-4-5-13812:%%domain-4:"}'];
                  
                    console.log("Suscription Sended")
                  
                    this.send(JSON.stringify(a))
              }
            };

      let fnOnMessage : (this: WebSocket, event: Event) => any;

      let fnOnClose : (this: WebSocket, event: Event) => any;
      let fnOnError : (this: WebSocket, event: Event) => any = function(error) {
        console.log(`[error] ${error["message"]}`);
      };
      let iniSocket = () => {
        this.iniSocket(url, fnOnOpen, fnOnMessage, fnOnClose, fnOnError);
      }
      fnOnClose = (event)=>{
        console.log('[close] Connection died', event["reason"]);
        iniSocket();
      }
      
      return new Observable<IndiceValor>(s =>{

        fnOnMessage = function(event) {
          
          if(event["data"]!=="o")
          {
            let jsonIn = JSON.parse(event["data"].substring(1))
            let indice = JSON.parse(jsonIn[0]);
            //message: 'pid-eu-8874::
            let id= `pid-eu-${idIndex}::`;
            if(indice.message && indice.message.includes(id))
            {
              let lastValueIndex : IndiceValor = JSON.parse(indice.message.replace(id, ""));
              let result = vm.tIndicat.setNextValueAllIndicatorIndex(idIndex.toString(), lastValueIndex.last_numeric);

              Object.assign(lastValueIndex, result);
              lastValueIndex.low = lastValueIndex.low.replace(",", ".");
              lastValueIndex.high = lastValueIndex.high.replace(",", ".");
              //envia siguiente valor
              s.next(lastValueIndex);
            }
            
          }
        };
        

        iniSocket();

      })


  }


  

  private iniSocket(url: string, fnOnOpen :(this: WebSocket, ev: Event) => any, fnOnMessage:(this: WebSocket, ev: Event) => void,
   fnOnClose : (this: WebSocket, ev: Event) => void, fnError:(this: WebSocket, error: Event) => any) : WebSocket
  {

    console.log("[iniSocket] ", url)
    var socket = new WebSocket(url);
    
    socket.onopen =fnOnOpen;
    
    socket.onmessage = fnOnMessage;
    
    socket.onclose = fnOnClose;
    
    socket.onerror = fnError



    return socket;
  }


}
