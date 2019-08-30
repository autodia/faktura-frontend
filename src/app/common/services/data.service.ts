/**
 * @module Services
 */

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AppError } from '../error-handling/app-error';
import { BadInputError } from '../error-handling/bad-request-error';
import { ConflictError } from '../error-handling/conflict-error';
import { NotFoundError } from '../error-handling/not-found-error';

export abstract class DataService<T> {
  private url: string;

  constructor(public http: HttpClient, resource: string, private includeToken: boolean = true) {
    this.url = environment.url + "/" + resource;
  }

  getAll(nested?: boolean, params?: Map<string, string>) {
    const options = this.createOptions(params);
    const url = nested ? this.url + "-nested" : this.url;

    return this.http.get<T[]>(url + '/', options).pipe(
      map(this.handleResponse),
      catchError(this.handleError)
    );
  }

  get(id, nested?: boolean, params?: Map<string, string>) {
    const options = this.createOptions(params);

    const url = nested ? this.url + "-nested" : this.url;

    return this.http.get<T>(url + '/' + id + '/', options).pipe(
      map(this.handleResponse),
      catchError(this.handleError)
    );
  }

  create(resource: any, nested?: boolean, params?: Map<string, string>): Observable<T> {
    const options = this.createOptions(params);
    const url = nested ? this.url + "-nested" : this.url;

    return this.http.post<T>(url + '/', resource, options).pipe(
      map(this.handleResponse),
      catchError(this.handleError)
    );
  }

  update(resource, nested?: boolean, params?: Map<string, string>): Observable<T> {
    const options = this.createOptions(params);
    const url = nested ? this.url + "-nested" : this.url;

    if (!resource.id) {
      return this.http.put<T>(url + '/' + resource.get('id') + '/', resource, options).pipe(
        map(this.handleResponse),
        catchError(this.handleError)
      )
    }
    else {
      return this.http.put<T>(url + '/' + resource.id + '/', resource, options).pipe(
        map(this.handleResponse),
        catchError(this.handleError)
      )
    }
  }

  patch(id, resource, params?: Map<string, string>): Observable<T> {
    const options = this.createOptions(params);

    return this.http.patch<T>(this.url + '/' + id + '/', resource, options).pipe(
      map(this.handleResponse),
      catchError(this.handleError)
    )
  }

  delete(id, params?: Map<string, string>) {
    const options = this.createOptions(params);

    return this.http.delete(this.url + '/' + id + "/", options)
      .pipe(catchError(this.handleError));
  }

  abstract handleResponse(data: any);

  createOptions(paramMap?: Map<string, string>) {
    let params = this.construcParams(paramMap);
    let headers = {}

    if (this.includeToken)
      this.addHeaderToken(headers)

    return { headers: headers, params: params }
  }

  addHeaderToken(headers: any) {
    let token = localStorage.getItem('token')
    headers['Authorization'] = 'Bearer ' + token
  }

  construcParams(paramMap: Map<string, string>): HttpParams {
    if (!paramMap) return null;

    let httpParams = new HttpParams();
    paramMap.forEach((value: string, key: string) => {
      httpParams = httpParams.append(key, value);
    });

    return httpParams;
  }

  handleError(error: Response) {
    if (error.status === 404) {
      return throwError(new NotFoundError(error));
    } else if (error.status === 400) {
      return throwError(new BadInputError(error));
    } else if (error.status === 409) {
      return throwError(new ConflictError(error));
    } else {
      return throwError(new AppError(error));
    }
  }
}