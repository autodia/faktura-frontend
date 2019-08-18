
import { Profile } from './profile';
import { Faktura } from './faktura';

/**
 * @module Model
 */

export class Parsing {

    id: number;

    data_fil: File
    mangel_liste_fil: any
    oprettet: Date
    oprettet_af: Profile

    fakturaer: Faktura[]

    flatten() {

        var return_obj: any = {
            id: this.id,
            data_fil: this.data_fil,
            mangel_liste_fil: this.mangel_liste_fil,
            oprettet: this.oprettet,
            oprettet_af: this.oprettet_af.id,
            fakturaer: []
        }

        if (this.fakturaer) {
            for (let faktura of this.fakturaer) {
                return_obj.fakturaer.push(faktura.id)
            }
        }

        return return_obj
    }
}