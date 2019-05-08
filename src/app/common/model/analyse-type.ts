import { AnalysePris } from './analyse-pris';

/**
 * @module Authentication
 */

export class AnalyseType {

    id: number;

    ydelses_kode: string
    ydelses_navn: string
    gruppering: string
    afdeling: string
    type: string
    kilde_navn: string
    duplikat: boolean

    priser: AnalysePris[]

    flatten() {

        let flatPriser = []

        for(let pris of this.priser){
            flatPriser.push(pris.id)
        }

        let return_obj =  {
            id: this.id,
            ydelses_kode: this.ydelses_kode,
            ydelses_navn: this.ydelses_navn,
            gruppering: this.gruppering,
            afdeling: this.afdeling,
            type: this.type,
            kilde_navn: this.kilde_navn,
            priser: flatPriser
        }

        return return_obj;
    }
}