import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../../services/http-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PERIOD_OPTIONS, PeriodType } from './periodOptions';
import { ChartWidgetComponent } from '../chart-widget/chart-widget.component';

@Component({
  selector: 'app-charts',
  imports: [FormsModule, CommonModule, ChartWidgetComponent],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css',
})
export class ChartsComponent implements OnInit {
  chart1: any;
  data: any;
  start = '';
  end = '';
  period: PeriodType = PERIOD_OPTIONS.LAST_MONTH;
  periodOptions = Object.values(PERIOD_OPTIONS);
  loading = false;

  chart1Legend = {
    header: 'Total Sales',
    leftNumber: 0,
    leftPerc: 0,
    rightNumber: 0,
    rightPerc: 0,
    leftTag: 'All Customers',
    rightTag: 'Loyalty Customers',
    chartType: 'line',
    labels: [] as string[],
    datasets: [] as any,
  };

  chart2Legend = {
    header: 'Sales Channel Breakdown',
    leftNumber: 0,
    leftPerc: 0,
    rightNumber: 0,
    rightPerc: 0,
    leftTag: 'In-store',
    rightTag: 'Online',
    chartType: 'bar',
    labels: [] as string[],
    datasets: [] as any,
  };

  constructor(private http: HttpServiceService) {}

  ngOnInit(): void {
    this.periodChanged();
  }

  periodChanged(applyButton = false) {
    if (applyButton) {
      this.period = PERIOD_OPTIONS.CUSTOM;
    }

    this.getPeriodRange();

    this.loading = true;

    this.http.getData(this.start, this.end).subscribe({
      next: (res) => {
        this.data = res;

        this.chart1Legend.leftNumber = this.data.allCustomers;
        this.chart1Legend.rightNumber = this.data.loyalCustomers;
        this.chart1Legend.leftPerc = this.data.allCustomersPerc;
        this.chart1Legend.rightPerc = this.data.loyalCustomersPerc;

        this.chart2Legend.leftNumber = this.data.instore;
        this.chart2Legend.rightNumber = this.data.online;
        this.chart2Legend.leftPerc = this.data.instorePerc;
        this.chart2Legend.rightPerc = this.data.onlinePerc;

        this.chart1Legend.labels = this.data.totalSales.map((c: any) => c.date);

        this.chart2Legend.labels = ['In-store', 'Online'];

        this.chart1Legend.datasets = [
          {
            label: 'Loyalty Customers',
            data: this.data.totalSales.map((c: any) => c.loyal),
            borderWidth: 2,
            borderColor: '#54b2d1',
            backgroundColor: '#54b2d1',
            pointRadius: 0,
            tension: 0.07,
            fill: true,
            gradient: {
              backgroundColor: {
                axis: 'y',
                colors: {
                  5000: 'white',
                  50000: '#54b2d1',
                },
              },
            },
          },
          {
            label: 'All Customers',
            data: this.data.totalSales.map((c: any) => c.allCustomers),
            borderWidth: 2,
            borderColor: '#e6c350',
            backgroundColor: '#e6c350',
            pointRadius: 0,
            tension: 0.07,
            fill: true,
            gradient: {
              backgroundColor: {
                axis: 'y',
                colors: {
                  5000: 'white',
                  50000: '#e6c350',
                },
              },
            },
          } as any,
        ];

        this.chart2Legend.datasets = [
          {
            data: [this.data.instore, this.data.online],
            backgroundColor: ['#f2d066', '#35c4dc'],
            borderColor: ['#f2d066', '#35c4dc'],
            borderWidth: 1,
            borderRadius: 5,
            borderSkipped: false,
            barThickness: 123,
          },
        ];

        this.loading = false;
      },
      error: (err) => {
        // console.log('===>err', err.error.error);
      },
    });
  }

  getPeriodRange() {
    const today = new Date();
    const end = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    switch (this.period) {
      case PERIOD_OPTIONS.CUSTOM:
        return;
      case PERIOD_OPTIONS.LAST_MONTH:
        this.start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
          .toISOString()
          .substring(0, 10);
        this.end = new Date(today.getFullYear(), today.getMonth(), 0)
          .toISOString()
          .substring(0, 10);
        return;
      case PERIOD_OPTIONS.LAST_QUARTER:
        const currentQuarter = Math.floor(today.getMonth() / 3);
        const startQuarterMonth = ((currentQuarter - 1 + 4) % 4) * 3;
        const quarterYear =
          currentQuarter === 0 ? today.getFullYear() - 1 : today.getFullYear();
        this.start = new Date(quarterYear, startQuarterMonth, 1)
          .toISOString()
          .substring(0, 10);
        this.end = new Date(quarterYear, startQuarterMonth + 3, 0)
          .toISOString()
          .substring(0, 10);
        return;
      case PERIOD_OPTIONS.LAST_YEAR:
        const endOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
        this.start = new Date(today.getFullYear() - 1, 0, 1)
          .toISOString()
          .substring(0, 10);
        this.end = endOfLastYear.toISOString().substring(0, 10);
        return;
    }
  }
}
