/**
 * @module Authentication
 */

export class AnalysePris {

    id: number;

    intern_pris: number
    ekstern_pris: number
    gyldig_fra: Date
    gyldig_til: Date
    analyse_type: number
    duplikat: boolean

    flatten() {

        return {
            id: this.id,
            intern_pris: this.intern_pris,
            ekstern_pris: this.ekstern_pris,
            gyldig_fra: this.gyldig_fra,
            gyldig_til: this.gyldig_til,
            analyse_type: this.analyse_type
        }
    }
}