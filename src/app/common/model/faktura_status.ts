/**
 * @module Model
 */

import { Type } from 'class-transformer';
import { Profile } from './profile';

export enum EnumFakturaStatus {
	oprettet = 10,
    faktura = 20,
    slettet = 30
}


export class FakturaStatus {
	id: number;
	faktura: number;
	status: number;
	oprettet_af: number;

	@Type(() => Date)
	dato: Date;
} 