import { Injectable } from '@angular/core';
import {forkJoin, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
path = environment.path;
  constructor(
    private http: HttpClient,
  ) { }

  public getJson(filename): Observable<any> {
    const file = this.path + filename + '.json';
    return this.http.get(file);
  }

  // public getAllData(files): Observable<any> {
  public getAllData(arr): Observable<any> {
    let object = {};
    for(var key in arr)
    {
      object = Object.assign({ [key]: this.getJson(arr[key]) }, object);
    }
    return forkJoin(object);
  }

}
