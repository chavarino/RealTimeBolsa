import { Injectable } from '@angular/core';

import {BollingerBands,RSI} from "technicalindicators"
import { Indicator, IndicatorInput } from 'technicalindicators/declarations/indicator/indicator';
import { RSIInput } from 'technicalindicators/declarations/oscillators/RSI';
import { BollingerBandsInput, BollingerBandsOutput } from 'technicalindicators/declarations/volatility/BollingerBands';
import { IndicatorsType, IndiceIndicatorInstance } from '../interfaces/data';


@Injectable({
  providedIn: 'root'
})
export class TecnicalIndicatorsService {


  input = {
    values : [1.81,1.79,1.82,1.77,1.7,1.58,1.59,1.57,1.65,1.61,1.61,1.7,1.68,1.75,1.8,1.82,1.76,1.71,1.7,1.71],
    period : 20,
    stdDev : 2
  };

  instances :  Map<string, IndiceIndicatorInstance>
  constructor() { 

      this.instances = new Map();
  }


  iniIndex(symbolIndex : string)
  {
      
    let iIndInst  : IndiceIndicatorInstance = {
      indice : symbolIndex,
      indicadores : new Map()

      
  }
  this.instances[symbolIndex]   = iIndInst;
  console.log("[iniIndex]", symbolIndex);
  return iIndInst;
  }

  IniBBIndicator(symbolIndex : string, keyIndicator : string, input : BollingerBandsInput)
  {

    if(input.values.length<input.period)
    {
      input.values.unshift(...this.input.values)
    }
      this.iniIndicator(symbolIndex, keyIndicator, IndicatorsType.BB, input);

 
 
 
    }

  IniRSIIndicator(symbolIndex : string, keyIndicator : string, input : RSIInput)
  {

    if(input.values.length<input.period)
    {
      input.values.unshift(...this.input.values)
    }

   
      this.iniIndicator(symbolIndex, keyIndicator, IndicatorsType.RSI, input);

  }
  
  iniIndicator(symbolIndex : string, keyIndicator : string, iType : IndicatorsType, input : IndicatorInput)
  {

    let index :IndiceIndicatorInstance = this.instances[symbolIndex];
    if(!index)
    {
      index =   this.iniIndex(symbolIndex);
    }
    
    let iInstance : Indicator;
    let auxInput;
    switch(iType)
    {
      case  IndicatorsType.BB:
          auxInput = input as BollingerBandsInput;
          iInstance = new  BollingerBands(
            auxInput
          );

        
       break;
       case  IndicatorsType.RSI:
        auxInput = input as BollingerBandsInput;
        iInstance = new  RSI(
          auxInput
        );
       break;
    }

   
    index.indicadores[keyIndicator] = iInstance;

    console.log("[iniIndicator]", symbolIndex, keyIndicator, iType, input)
    
  }


  nextValueIndicator(symbolIndex : string, keyIndicator : string, nextValue:number) : BollingerBandsOutput | number
  { 

    let res = this.instances[symbolIndex].indicadores[keyIndicator].nextValue(nextValue);
    console.log("[nextValueIndicator]", symbolIndex, keyIndicator, nextValue, res);

    return res;

  }



  setNextValueAllIndicatorIndex(symbolIndex : string, nextValue: number) : Map<string, number | BollingerBandsOutput>
  {
      let aux : IndiceIndicatorInstance = this.instances[symbolIndex];
      let res : Map<string, number | BollingerBandsOutput> = new Map();

      Object.keys(aux.indicadores).forEach(keyIndicator => {
        res[keyIndicator] = this.nextValueIndicator(symbolIndex, keyIndicator, nextValue);
        
      });


      return res;
  }


}
