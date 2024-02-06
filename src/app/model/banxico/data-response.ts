export interface BanxicoDataResponse {
    bmx: {
        series: Series[];
    };
}

export interface Series {
    idSerie: string;
    titulo: string;
    datos: Dato[];
}

export interface Dato {
    fecha: string;
    dato: string;
}