import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

    constructor(private messageApi: MessageService) { }

    public invocarSnackbar(type: number, message: string, sticky?: boolean): void {
        if ( type === 1 ) {
            this.messageApi.add({
                severity: 'success',
                summary: 'Correcto',
                detail: message,
                life: 5000,
                sticky: sticky
            });
        } else if ( type === 0 ) {
            this.messageApi.add({
                severity: 'error',
                summary: 'Error',
                detail: message,
                life: 5000,
                sticky: sticky
            });
        } else if ( type === -1 ) {
            this.messageApi.add({
                severity: 'warn',
                summary: 'Aviso',
                detail: message,
                life: 5000,
                sticky: sticky
            });
        }
    }

}
