/**
 * @module Services
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from '../../../environments/environment';

@Injectable()
export class UploadService {

  url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url + "/receipt-file/"
  }

  upload(form: FormData): Observable<any> {
    return this.http.post(this.url, form)
  }
}