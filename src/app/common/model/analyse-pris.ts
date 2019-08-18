import { AnalyseType } from './analyse-type';

/**
 * @module Model
 */

export class AnalysePris {

    id: number;

    intern_pris: number
    ekstern_pris: number
    gyldig_fra: Date
    gyldig_til: Date
    
    analyse_type: AnalyseType
    duplikat: boolean

    flatten() {

        return {
            id: this.id,
            intern_pris: this.intern_pris,
            ekstern_pris: this.ekstern_pris,
            gyldig_fra: this.gyldig_fra,
            gyldig_til: this.gyldig_til,
            analyse_type: this.analyse_type.id
        }
    }
}