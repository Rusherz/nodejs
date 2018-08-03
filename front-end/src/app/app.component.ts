import { Component } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	public chart = [];

	public dataPoints = [{ "type": "column", "dataPoints": [{ "label": "Bazaar", "x": 0, "y": 8 }, { "label": "Cargo", "x": 1, "y": 0 }, { "label": "Downfall", "x": 2, "y": 0 }, { "label": "Quarantine", "x": 3, "y": 10 }, { "label": "Suburbia", "x": 4, "y": 8 }, { "label": "Subway", "x": 5, "y": 0 }, { "label": "Tanker", "x": 6, "y": 0 }] }, { "type": "column", "dataPoints": [{ "label": "Bazaar", "x": 0, "y": 6 }, { "label": "Cargo", "x": 1, "y": 0 }, { "label": "Downfall", "x": 2, "y": 0 }, { "label": "Quarantine", "x": 3, "y": 6 }, { "label": "Suburbia", "x": 4, "y": 7 }, { "label": "Subway", "x": 5, "y": 0 }, { "label": "Tanker", "x": 6, "y": 5 }] }]

	ngOnInit() {
		console.log(this.dataPoints);
		let temp_max = [24, 25, 23, 23, 16];
		let temp_min = [24, 25, 23, 23, 16];
		let canvas = <HTMLCanvasElement>document.getElementById("canvas");
		let ctx = canvas.getContext("2d");
		this.chart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: ['Bazaar', 'Cargo', 'Downfall', 'Q1', 'Suburbia', 'Subway', 'Tanker'],
				datasets: [
					[
						{
							"data": 8
						},
						{
							"data": 0
						},
						{
							"data": 0
						},
						{
							"data": 10
						},
						{
							"data": 8
						},
						{
							"data": 0
						},
						{
							"data": 0
						}
					],
					[
						{
							"data": 6
						},
						{
							"data": 0
						},
						{
							"data": 0
						},
						{
							"data": 6
						},
						{
							"data": 7
						},
						{
							"data": 0
						},
						{
							"data": 5
						}
					]
				]
			},
			options: {
				legend: {
					display: false
				},
				scales: {
					xAxes: [{
						display: true
					}],
					yAxes: [{
						display: true
					}],
				}
			}
		});
	}


	title = 'app';
}
