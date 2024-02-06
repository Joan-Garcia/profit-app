import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EMPTY, Observable } from "rxjs";
import { SnackbarService } from "../services/shared/snackbar/snackbar.service";
import { SpinnerService } from "../services/shared/spinner/spinner.service";

@Injectable({
    providedIn: 'root',
})
export class ErrorHandler {
    constructor(
        private snackbarService: SnackbarService,
        private spinnerService: SpinnerService,
    ){}

    public httpHandleError(error: HttpErrorResponse): Observable<never> {
        this.spinnerService.loading = false;
        if ( error instanceof HttpErrorResponse && error.status === 400 ) {
            this.snackbarService.invocarSnackbar(0, error.error);
            return EMPTY;
        } else if ( error instanceof HttpErrorResponse && error.status === 404 ) {
            this.snackbarService.invocarSnackbar(0, error.error);
            return EMPTY;
        } else {
            this.snackbarService.invocarSnackbar(0, 'Ocurrió un problema con el servidor.');
            console.log(error);
            return EMPTY;
        }
    }
}
