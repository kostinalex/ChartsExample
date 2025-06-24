import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toFont } from 'chart.js/helpers';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import gradientPlugin from 'chartjs-plugin-gradient';

@Component({
  selector: 'app-chart',
  imports: [FormsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent implements OnInit {
  @Input() start = '';
  @Input() end = '';
  @Input() legend: any;
  @Input() loading = false;
  labelIndexes: any;
  id = Date.now().toString(36) + Math.random().toString(36).substring(2);
  chart: any;

  constructor() {
    Chart.register(...registerables, zoomPlugin, gradientPlugin);
  }

  ngOnInit(): void {
    this.showChart();
  }

  showChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
    setTimeout(() => {
      this.labelIndexes = new Set(this.reduceLabels(this.legend.labels));

      const customTickAlignPlugin = {
        id: 'customTickAlignPlugin',
        afterDraw(chart: any) {
          const xAxis = chart.scales['x'];
          const ctx = chart.ctx;
          const ticks = xAxis.ticks;
          const options = xAxis.options.ticks;

          ctx.save();
          ctx.font = toFont(options.font).string;

          ctx.fillStyle = options.color || '#666';

          ticks.forEach((tick: any, index: any) => {
            const x = xAxis.getPixelForTick(index);
            const y = xAxis.bottom + options.padding;

            const label = tick.label;

            if (!label) return;

            const textWidth = ctx.measureText(label).width;
            let drawX = x;

            if (index == 0) {
              drawX = x - xAxis.width / ticks.length / 2 + 30;
            } else if (index == ticks.length - 1) {
              drawX = x - xAxis.width / ticks.length / 2 + 13;
            } else {
              drawX = x;
            }

            ctx.textAlign = index == 0 ? 'left' : 'center';
            ctx.fillText(label, drawX, y);
          });

          ctx.restore();
        },
      };

      let plugins = [] as any;
      let displayDefaultTicks = true;
      let paddingBottom = 0;
      let xTicksPadding = 5;

      if (this.legend.chartType == 'line') {
        plugins = [customTickAlignPlugin];
        displayDefaultTicks = false;
        paddingBottom = 20;
        xTicksPadding = 15;
      }

      this.chart = new Chart(this.id, {
        type: this.legend.chartType,
        plugins,
        data: {
          labels: this.legend.labels,
          datasets: this.legend.datasets,
        },
        options: {
          layout: {
            padding: {
              bottom: paddingBottom,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            zoom: {
              pan: {
                enabled: true,
                mode: 'xy',
              },
              zoom: {
                wheel: {
                  enabled: true,
                },
                pinch: {
                  enabled: true,
                },
                mode: 'x',
              },
            },
          },
          scales: {
            x: {
              ticks: {
                padding: xTicksPadding,
                display: displayDefaultTicks,
                align: 'center',
                callback: (value: any, index: any) => {
                  if (this.labelIndexes.has(index)) {
                    return this.legend.labels[index];
                  }
                  return null;
                },
                font: {
                  size: 10,
                  family: 'Poppins',
                },
                minRotation: 0,
                maxRotation: 0,
              },
              grid: {
                display: false,
              },
              border: {
                display: false,
              },
            },
            y: {
              max: 50000,

              ticks: {
                padding: 5,
                stepSize: 5000,
                callback: (value: any) => '$' + value.toLocaleString(),
                font: {
                  size: 10,
                  family: 'Poppins',
                },
              },
              grid: {
                display: true,
                lineWidth: 1.5,
                color: (context: any) => {
                  if (
                    context.tick.value === 0 &&
                    this.legend.chartType == 'line'
                  ) {
                    return 'rgba(0,0,0,0)';
                  }
                  return '#eeeeee';
                },
                drawTicks: false,
                drawOnChartArea: true,
              },
              border: {
                display: false,
                dash: [5, 2],
              },
            },
          },
        },
      });
    }, 100);
  }

  reduceLabels(arr: any) {
    const n = arr.length;
    const indexes = [];

    if (n < 6) {
      for (let i = 0; i < n; i++) {
        indexes.push(i);
      }
      return indexes;
    }

    indexes.push(0);
    for (let i = 1; i <= 4; i++) {
      const idx = Math.round((i * (n - 1)) / 5);
      indexes.push(idx);
    }
    indexes.push(n - 1);

    return indexes;
  }
}
