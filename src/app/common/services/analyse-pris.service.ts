/**
 * @module Services
 */

import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { plainToClass } from 'class-transformer';
import { AnalysePris } from '../model/analyse-pris';

@Injectable({
  providedIn: 'root'
})
export class AnalysePrisService extends DataService<AnalysePris> {

  constructor(http: HttpClient) {
    super(http, 'analyse-priser');
  }

  handleResponse(data: any) {
    return plainToClass(AnalysePris, data);
  }
}