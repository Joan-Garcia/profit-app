import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
    private _loading: BehaviorSubject<boolean>;

    constructor() {
        this._loading = new BehaviorSubject<boolean>(false);
    }


    public set loading(value: boolean) {
        this._loading.next(value);
    }

    public get loading(): boolean {
        return this._loading.getValue();
    }

    public get loading$(): Observable<boolean> {
        return this._loading.asObservable();
    }

}
