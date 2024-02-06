import { Component, OnInit } from '@angular/core';
import { BanxicoApiService } from '../../services/banxico/banxico-api.service';
import { Dato } from '../../model/banxico/data-response';
import { finalize } from 'rxjs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { SpinnerService } from '../../services/shared/spinner/spinner.service';
dayjs.extend(customParseFormat);


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    public cetes28Data: Dato[];
    public inflationData: Dato[];
    public targetRateData: Dato[];

    public lastCetes28DaysRate: string;
    public lastInflationRate: string;
    public lastInflationRateMonth: string;
    public realProfitRate: string;
    public lastTargetRate: string;
    public lastTargetRateMonth: string;

    public chartProfitRateData: any;
    public chartProfitRateOptions: any;

    public chartCetesData: any;
    public chartCetesOptions: any;

    public chartInflationData: any;
    public chartInflationOptions: any;

    constructor(
        private banxicoApiService: BanxicoApiService,
        public spinnerService: SpinnerService
    ) {
        this.cetes28Data = null;
        this.inflationData = null;

        const documentStyle = getComputedStyle(document.documentElement);

        this.chartProfitRateData = {
            datasets: [
                {
                    label: 'Rendimiento real de CETES a 28 días',
                    data: null,
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--green-500'),
                    tension: 0.4
                }
            ]
        };
        this.chartProfitRateOptions = this.getChartOptions();

        this.chartCetesData = {
            datasets: [
                {
                    label: 'Tasa de CETES a 28 días',
                    data: null,
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4
                },
                {
                    label: 'Tasa objetivo de Banxico',
                    data: null,
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--pink-500'),
                    tension: 0.4
                }
            ]
        };
        this.chartCetesOptions = this.getChartOptions();

        this.chartInflationData = {
            datasets: [
                {
                    label: 'Inflación',
                    data: null,
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--green-500'),
                    tension: 0.4
                },
                {
                    label: 'Tasa objetivo de Banxico',
                    data: null,
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--pink-500'),
                    tension: 0.4
                }
            ]
        };
        this.chartInflationOptions = this.getChartOptions();
    }
    
    ngOnInit(): void {
        this.getData();
    }

    private getData(): void {
        this.spinnerService.loading = true;
        this.banxicoApiService.getBanxicoSeries()
        .pipe(finalize(() => this.spinnerService.loading = false))
        .subscribe(response => {
            this.cetes28Data = response.bmx.series.find(serie => serie.idSerie === 'SF43936').datos;
            this.inflationData = response.bmx.series.find(serie => serie.idSerie === 'SP30578').datos;
            this.targetRateData = response.bmx.series.find(serie => serie.idSerie === 'SF61745').datos;

            this.lastCetes28DaysRate = this.cetes28Data[this.cetes28Data.length - 1].dato + '%';
            this.lastInflationRate = this.inflationData[this.inflationData.length - 1].dato + '%';
            this.lastInflationRateMonth = this.inflationData[this.inflationData.length - 1].fecha;
            this.lastTargetRate = this.targetRateData[this.targetRateData.length - 1].dato + '%';
            this.lastTargetRateMonth = this.targetRateData[this.targetRateData.length - 1].fecha;

            this.realProfitRate = (parseFloat(this.lastCetes28DaysRate) - parseFloat(this.lastInflationRate)) + '%';

            this.initChartsDatasets();
        });
    }

    private initChartsDatasets(): void {
        const cetes28ChartData = this.cetes28Data.filter(dato => !isNaN(Number(dato.dato)));
        this.chartCetesData.datasets[0].data = cetes28ChartData.map(dato => {
            return {
                fecha: dato.fecha,
                dato: parseFloat(dato.dato)
            }
        });

        const targetRateChartData = this.targetRateData.filter(dato => !isNaN(Number(dato.dato)) && cetes28ChartData.find(d => d.fecha === dato.fecha));
        this.chartCetesData.datasets[1].data = targetRateChartData.map(dato => {
            return {
                fecha: dato.fecha,
                dato: parseFloat(dato.dato)
            }
        });

        const inflationChartData = this.inflationData.filter(dato => !isNaN(Number(dato.dato)));
        this.chartInflationData.datasets[0].data = inflationChartData.map(dato => {
            return {
                fecha: dato.fecha,
                dato: parseFloat(dato.dato)
            }
        });

        const targetRateChartData2 = this.targetRateData.filter(dato => !isNaN(Number(dato.dato)) && inflationChartData.find(d => d.fecha === dato.fecha));
        this.chartInflationData.datasets[1].data = targetRateChartData2.map(dato => {
            return {
                fecha: dato.fecha,
                dato: parseFloat(dato.dato)
            }
        });

        this.chartProfitRateData.datasets[0].data = cetes28ChartData.map(dato => {
            const inflation = inflationChartData.find(d => dayjs(dato.fecha, 'DD/MM/YYYY').isSame(dayjs(d.fecha, 'DD/MM/YYYY'), 'month'));

            return {
                fecha: dato.fecha,
                dato: parseFloat(dato.dato) - (inflation? parseFloat(inflation.dato) : parseFloat(this.lastInflationRate))
            }
        });
    }

    public get isLatestCetes28RateHigher(): number {
        if (!this.lastCetes28DaysRate) return null;

        if (parseFloat(this.lastCetes28DaysRate) === parseFloat(this.cetes28Data[this.cetes28Data.length - 2].dato))
        return 2;

        if (parseFloat(this.lastCetes28DaysRate) > parseFloat(this.cetes28Data[this.cetes28Data.length - 2].dato))
            return 1;
        else return 0;
    }

    public get isLatestInflationRateHigher(): number {
        if (!this.lastInflationRate) return null;
        if (parseFloat(this.lastInflationRate) === parseFloat(this.inflationData[this.inflationData.length - 2].dato))
        return 2;

        if (parseFloat(this.lastInflationRate) > parseFloat(this.inflationData[this.inflationData.length - 2].dato))
            return 1;
        else return 0;
    }

    public get isLatestTargetRateHigher(): number {
        if (!this.lastTargetRate) return null;
        if (parseFloat(this.lastTargetRate) === parseFloat(this.targetRateData[this.targetRateData.length - 2].dato))
        return 2;

        if (parseFloat(this.lastTargetRate) > parseFloat(this.targetRateData[this.targetRateData.length - 2].dato))
            return 1;
        else return 0;
    }

    private getChartOptions(): any {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        return {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        autoSkip: true,
                        maxTicksLimit: 10
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            },
            parsing: {
                xAxisKey: 'fecha',
                yAxisKey: 'dato'
            }
        };
    }
    
}
