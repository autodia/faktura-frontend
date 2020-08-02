/**
 * @module Services
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from '../../../environments/environment';

@Injectable()
export class SendService {

  url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url + "/" + "send/"
  }

  send(): Observable<any> {
    let headers = {}
    let token = localStorage.getItem('token')
    headers['Authorization'] = token

    const options = {
      headers: headers
    };

    return this.http.get(this.url, options)
  }
}