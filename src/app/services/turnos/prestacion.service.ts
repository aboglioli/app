import { IPrestacion } from './../../interfaces/turnos/IPrestacion';
import { Observable } from 'rxjs/Rx';
import { Headers, Http, RequestOptions, RequestMethod, Response } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class PrestacionService {
    private prestacionUrl = 'http://localhost:3002/api/turnos/prestacion';  // URL to web api
    constructor(private http: Http) { }
    
    get(): Observable<IPrestacion[]> {
       return this.http.get(this.prestacionUrl)
           .map((res:Response) => res.json())
           .catch(this.handleError); //...errors if any*/
   }

    handleError(error: any){
        console.log(error.json());
        return Observable.throw(error.json().error || 'Server error');
    }
}