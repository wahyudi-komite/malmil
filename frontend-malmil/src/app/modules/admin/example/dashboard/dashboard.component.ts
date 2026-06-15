import { CommonModule, DecimalPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { FuseCardComponent } from '../../../../../@fuse/components/card';
import { DashboardService } from './dashboard.service';

@Component({
    selector: 'app-dashboard',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatButtonToggleModule,
        NgApexchartsModule,
        MatTooltipModule,
        DecimalPipe,
        FuseCardComponent,
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
    // chartVisitors: ApexOptions;
    // chartConversions: ApexOptions;
    // chartImpressions: ApexOptions;
    // chartVisits: ApexOptions;
    // chartVisitorsVsPageViews: ApexOptions;
    // chartNewVsReturning: ApexOptions;
    chartHum1: ApexOptions;
    chartHum2: ApexOptions;
    chartHum3: ApexOptions;
    chartFreq: ApexOptions;
    // chartAge: ApexOptions;
    // chartLanguage: ApexOptions;
    data: any;
    maxTemp: number = 33;
    jumMcbs = [
        { num: 12, loc: 'S/A PISTON' },
        { num: 13, loc: 'S/A BLOCK' },
        { num: 14, loc: 'S/A HEAD' },
        { num: 15, loc: 'REST AREA' },
        { num: 16, loc: 'PARTIAL ML' },
        { num: 17, loc: 'PARTIAL ML' },
        { num: 18, loc: 'SPS' },
        { num: 19, loc: 'MOTORIZE VALVE' },
    ];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _analyticsService: DashboardService,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the data
        this._analyticsService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.data = data.data[0];
                console.log(this.data[0]);

                // Prepare the chart data
                this._prepareChartData();
            });

        // Attach SVG fill fixer to all ApexCharts
        window['Apex'] = {
            chart: {
                events: {
                    mounted: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                    updated: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                },
            },
        };
    }

    private _prepareChartData(): void {
        this.chartHum1 = {
            chart: {
                height: '300px',
                width: '400px',
                animations: {
                    speed: 400,
                    animateGradually: {
                        enabled: false,
                    },
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                type: 'radialBar',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#2563eb'],
            labels: ['Humidity'],
            plotOptions: {
                radialBar: {
                    hollow: {
                        size: '35%',
                    },
                    startAngle: -100,
                    endAngle: 100,
                    dataLabels: {
                        name: {
                            show: false,
                        },
                        value: {
                            fontWeight: '700',
                            fontSize: '35px',
                            color: '#2563eb',
                            show: true,
                        },
                    },
                },
            },
            // series: this.data.gender.series,
            series: [this.data.hd1_hum],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                    },
                },
            },
            tooltip: {
                enabled: true,
                fillSeriesColor: false,
                theme: 'dark',
                custom: ({
                    seriesIndex,
                    w,
                }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                                 <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
                                                 <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
                                                 <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}%</div>
                                             </div>`,
            },
        };

        this.chartHum2 = {
            chart: {
                height: '300px',
                width: '400px',
                animations: {
                    speed: 400,
                    animateGradually: {
                        enabled: false,
                    },
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                type: 'radialBar',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#2563eb'],
            labels: ['Humidity'],
            plotOptions: {
                radialBar: {
                    hollow: {
                        size: '35%',
                    },
                    startAngle: -100,
                    endAngle: 100,
                    dataLabels: {
                        name: {
                            show: false,
                        },
                        value: {
                            fontWeight: '700',
                            fontSize: '35px',
                            color: '#2563eb',
                            show: true,
                        },
                    },
                },
            },
            // series: this.data.gender.series,
            series: [this.data.hd2_hum],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                    },
                },
            },
            tooltip: {
                enabled: true,
                fillSeriesColor: false,
                theme: 'dark',
                custom: ({
                    seriesIndex,
                    w,
                }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                                 <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
                                                 <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
                                                 <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}%</div>
                                             </div>`,
            },
        };

        this.chartHum3 = {
            chart: {
                height: '300px',
                width: '400px',
                animations: {
                    speed: 400,
                    animateGradually: {
                        enabled: false,
                    },
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                type: 'radialBar',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#2563eb'],
            labels: ['Humidity'],
            plotOptions: {
                radialBar: {
                    hollow: {
                        size: '35%',
                    },
                    startAngle: -100,
                    endAngle: 100,
                    dataLabels: {
                        name: {
                            show: false,
                        },
                        value: {
                            fontWeight: '700',
                            fontSize: '35px',
                            color: '#2563eb',
                            show: true,
                        },
                    },
                },
            },
            // series: this.data.gender.series,
            series: [this.data.hd3_hum],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                    },
                },
            },
            tooltip: {
                enabled: true,
                fillSeriesColor: false,
                theme: 'dark',
                custom: ({
                    seriesIndex,
                    w,
                }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                                 <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
                                                 <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
                                                 <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}%</div>
                                             </div>`,
            },
        };

        this.chartFreq = {
            chart: {
                // height: '1000px',
                width: '400px',
                animations: {
                    speed: 400,
                    animateGradually: {
                        enabled: false,
                    },
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                type: 'radialBar',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#f59e0b'],
            labels: ['Frequency'],
            plotOptions: {
                radialBar: {
                    hollow: {
                        size: '50%',
                    },
                    startAngle: -100,
                    endAngle: 100,
                    dataLabels: {
                        name: {
                            show: false,
                        },
                        value: {
                            fontWeight: '700',
                            fontSize: '45px',
                            color: '#f59e0b',
                            show: true,
                            formatter: function (val) {
                                return val + ' Hz';
                            },
                        },
                    },
                },
            },
            // series: this.data.gender.series,
            series: [this.data.freq],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                    },
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: 'horizontal',
                    gradientToColors: ['#87D4F9'],
                    stops: [0, 100],
                },
            },
            tooltip: {
                enabled: true,
                fillSeriesColor: false,
                theme: 'dark',
                custom: ({
                    seriesIndex,
                    w,
                }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                                 <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
                                                 <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
                                                 <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}%</div>
                                             </div>`,
            },
        };
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fix the SVG fill references. This fix must be applied to all ApexCharts
     * charts in order to fix 'black color on gradient fills on certain browsers'
     * issue caused by the '<base>' tag.
     *
     * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
     *
     * @param element
     * @private
     */
    private _fixSvgFill(element: Element): void {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
            .filter((el) => el.getAttribute('fill').indexOf('url(') !== -1)
            .forEach((el) => {
                const attrVal = el.getAttribute('fill');
                el.setAttribute(
                    'fill',
                    `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`
                );
            });
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */

    displayStatus(status): string {
        return status === 1 ? ' bg-green-500  ' : 'bg-gray-500 ';
    }
}
