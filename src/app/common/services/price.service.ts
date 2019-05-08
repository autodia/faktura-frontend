/**
 * @module Authentication
 */

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { User } from '../model/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PriceService {
  private endpoint = "priser";
  private url: string;

  constructor(private http: HttpClient,
    public router: Router) {
    this.url = environment.url + "/" + this.endpoint + "/";
  }

  /**
   * Creates new prices objects and returns them without saving them in the database 
   * @param file The file which the prices will be generated from
   */
  createPrices(file) {
    return this.http.post<any>(this.url, file)
      .pipe(map(response => {
        return response;
      }));
  }
}
