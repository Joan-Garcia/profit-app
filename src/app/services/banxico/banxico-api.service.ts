import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { BanxicoDataResponse } from '../../model/banxico/data-response';
import { environment } from '../../../environments/environment';
import { ErrorHandler } from '../../utils/error-handler';

@Injectable({
  providedIn: 'root'
})
export class BanxicoApiService {
    private headers: HttpHeaders;

    constructor(
        private http: HttpClient,
        private errorHandler: ErrorHandler
    ) {
        this.headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Accept: 'application/json',
        });
    }

    public getBanxicoSeries(): Observable<BanxicoDataResponse> {
        return this.http.get<BanxicoDataResponse>(`${environment.apiUrl}/banxico`, {
            headers: this.headers
        }).pipe(catchError(error => this.errorHandler.httpHandleError(error)));
    }
}
