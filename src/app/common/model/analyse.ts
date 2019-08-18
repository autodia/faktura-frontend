import { AnalyseType } from './analyse-type';

/**
 * @module Model
 */

export class Analyse {

    id: number;

    antal: number
    styk_pris: number
    samlet_pris: number
    CPR: string
    afregnings_dato: Date
    svar_dato: Date

    analyse_type: AnalyseType
    faktura: number

    flatten() {

        return {
            id: this.id,
            antal: this.antal,
            styk_pris: this.styk_pris,
            samlet_pris: this.samlet_pris,
            CPR: this.CPR,
            afregnings_dato: this.afregnings_dato,
            svar_dato: this.svar_dato,
            analyse_type: this.analyse_type.id,
            faktura: this.faktura
        }
    }
}