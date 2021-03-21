import { LocalStoreService } from "../services/local-store.service";

export abstract class GenericAbstractComponent {

    constructor(readonly id:string, private localData : LocalStoreService)
    {

    }


    loadModelFromLocalStorage<T>(fnOnLoad : (values : T) => void)
    {
        this.localData.getValue<T>(this.id, (values : T) => {

            if(values)
            {

                fnOnLoad(values);
            }
        });
    }

    saveModelFromLocalStorage(model )
    {
        this.localData.setValue(this.id, model);
    }


    
}