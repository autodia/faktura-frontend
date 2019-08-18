import { Analyse } from './analyse';
import { Rekvirent } from './rekvirent';
import { EnumFakturaStatus } from './faktura_status';
import { Profile } from './profile';

/**
 * @module Model
 */

export class Faktura {

    id: number;

    pdf_fil: any
    oprettet: Date
    antal_linjer: number
    samlet_pris: number
    status: EnumFakturaStatus
    parsing: number
    rekvirent: Rekvirent

    analyser: Analyse[]

    flatten() {

        var return_obj: any = {
            id: this.id,
            pdf_fil: this.pdf_fil,
            oprettet: this.oprettet,
            antal_linjer: this.antal_linjer,
            samlet_pris: this.samlet_pris,
            status: this.status,
            parsing: this.parsing,
            rekvirent: this.rekvirent.id,
            analyser: []
        }

        if(this.analyser){
            for(let analyse of this.analyser){
                return_obj.analyser.push(analyse.id)
            }
        }

        return return_obj
    }
}