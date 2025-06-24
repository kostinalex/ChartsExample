import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-chart-widget',
  imports: [CommonModule, ChartComponent],
  templateUrl: './chart-widget.component.html',
  styleUrl: './chart-widget.component.css',
})
export class ChartWidgetComponent implements OnInit {
  @Input() start = '';
  @Input() end = '';
  @Input() data: any;
  @Input() loading = false;
  @Input() legend: any;

  constructor() {}

  ngOnInit(): void {}

  formatDate(inputDate: string) {
    return new Date(inputDate + 'T10:00:00.000Z').toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });
  }
}
