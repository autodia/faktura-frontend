/**
 * @module Services
 */

import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { plainToClass } from 'class-transformer';
import { AnalyseType } from '../model/analyse-type';

@Injectable({
  providedIn: 'root'
})
export class AnalyseTypeService extends DataService<AnalyseType> {

  constructor(http: HttpClient) {
    super(http, 'analyse-typer');
  }

  handleResponse(data: any) {
    return plainToClass(AnalyseType, data);
  }
}