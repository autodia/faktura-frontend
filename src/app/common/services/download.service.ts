/**
 * @module Services
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { environment } from '../../../environments/environment';

@Injectable()
export class DownloadService {

  url: string;

  constructor(private http: HttpClient) {
    this.url = environment.url + "/" + "download/"
  }

  /**
   * Downsloads a single file as a blob
   * @param path the url path
   */
  download(path: string): Observable<any> {
    let params = new HttpParams();
    params = params.append("path", path);

    const options = {
      params: params,
      responseType: "blob" as "blob"
    };

    return this.http.get(this.url, options)
  }
}