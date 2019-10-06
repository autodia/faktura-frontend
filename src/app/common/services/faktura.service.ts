/**
 * @module Services
 */

import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { plainToClass } from 'class-transformer';
import { Faktura } from '../model/faktura';

@Injectable({
  providedIn: 'root'
})
export class FakturaService extends DataService<Faktura> {

  constructor(http: HttpClient) {
    super(http, 'faktura');
  }

  handleResponse(data: any) {
    return plainToClass(Faktura, data);
  }
}