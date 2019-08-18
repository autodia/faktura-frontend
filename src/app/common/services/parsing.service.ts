/**
 * @module Services
 */

import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { plainToClass } from 'class-transformer';
import { Parsing } from '../model/parsing';

@Injectable({
  providedIn: 'root'
})
export class ParsingService extends DataService<Parsing> {

  constructor(http: HttpClient) {
    super(http, 'parsing');
  }

  handleResponse(data: any) {
    return plainToClass(Parsing, data);
  }
}