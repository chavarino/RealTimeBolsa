import { Indicator, IndicatorInput } from 'technicalindicators/declarations/indicator/indicator';
import { BollingerBandsOutput } from 'technicalindicators/declarations/volatility/BollingerBands';
import { SoundClass } from '../clases/sound';



export interface IndiceValor {
    pid: string;
    last_dir: string;
    last_numeric: number;
    last: string;
    bid: string;
    ask: string;
    high: string;
    low: string;
    pc: string;
    pcp: string;
    pc_col: string;
    time: string;
    timestamp: number;
    rsi: number;
    bollingBands: BollingBands;
    rsiAux: number;
    bb2: BollingBands;
  }
  
 export  interface BollingBands {
    middle: number;
    upper: number;
    lower: number;
    pb: number;
  }


  
  export interface IndiceIndicatorInstance {
    indice : string,

    indicadores : Map<string, Indicator>

}


export enum IndicatorsType {
    BB = 1,
    RSI =2
}


export interface Senial {

  indice : String,

  estrategia : String,

  //indiceValor : IndiceValor,
  hora : string,
  accion : string ,

  colorSenial : string,
  info : string,
  valorActual : number,
  colorTendencia : string,
  tipoArrow :string,
  background : string,
  isSenialRelevante : boolean,
  valorMaxActual : number,
  valorMinActual :number
  isMin : boolean,
  isMax : boolean

  
}


export interface Alerta {

  sonido : SoundClass,
  habilitado: boolean
}

export interface IndiceInfo {

  nombre :string,
  id: number
}

export interface CalculadoraInputs {
  ganancia: number;
  dinero : number,
  precCompra : number,
  precVenta : number,
  isPrecioManual : boolean,
  isInverso ?: boolean,
  isLoaded ?: boolean
}

export interface ObjectCustom<T> {
  [key: string] : T
}

export enum TipoLimite {

    INFERIOR = 1,
    SUPERIOR = 2
}
export interface Limite {
  label ?: string,
  valor : number,
  habilitado : boolean,
  tipo :TipoLimite
}