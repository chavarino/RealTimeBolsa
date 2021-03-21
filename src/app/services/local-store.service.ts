import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class LocalStoreService {

  constructor(private storage : Storage) { }

  

  getValue<T>( key : string,  fn : ( value : T)=>void)
  {
    this.storage.get(key).then((value : T)=>{
      console.log("getValue:", key, value)
      fn(value)
    });

  }


  setValue<T>(key : string, value :T)
  {
    console.log("setValue:", key, value)
    this.storage.set(key, value);

  }
}
