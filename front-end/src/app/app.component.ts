import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { PlatformLocation } from '@angular/common';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	public chart = undefined;
	public teamNames: string[] = [];
	public teamOne: string = undefined;
	public teamTwo: string = undefined;
	public TeamNames: string[] = [];
	public roundsMaps: string = 'rounds';
	public date: Date;

	private url: string = '';

	constructor(private http: HttpClient, platformLocation: PlatformLocation) {
		this.url = 'http://' + (platformLocation as any).location.hostname;
	}

	ngOnInit() {
		this.http.get(this.url + ':4000/getLastUpdated').subscribe(data => {
			this.date = new Date(data['DATE']);
		})
		this.http.get(this.url + ':4000/allTeamNames').subscribe((teamNames: Object[]) => {
			for (let teamName of teamNames) {
				this.teamNames.push(teamName['team'])
			}
		});
		this.initChart();
	}

	getChartData() {
		this.TeamNames = [];
		if (this.teamOne && this.teamOne != 'undefined') {
			this.TeamNames.push(this.teamOne)
		}
		if (this.teamTwo && this.teamTwo != 'undefined') {
			this.TeamNames.push(this.teamTwo)
		}
		this.http.post(this.url + ':4000/chartwinloss', { 'teamNames': this.TeamNames, 'roundsMaps': this.roundsMaps }).subscribe(data => {
			this.chart.data.datasets = data;
			this.chart.update();
		});
	}

	updateData() {
		this.http.get(this.url + ':4000').subscribe(data => {
			this.date = new Date(data['DATE']);
		});
	}

	initChart() {
		this.http.post(this.url + ':4000/chartwinloss', { 'teamNames': this.TeamNames, 'roundsMaps': 'rounds' }).subscribe(data => {
			this.chart = undefined;
			let canvas = <HTMLCanvasElement>document.getElementById("canvas");
			let ctx = canvas.getContext("2d");
			this.chart = new Chart(ctx, {
				type: 'bar',
				data: {
					labels: ['Bazaar', 'Cargo', 'Downfall', 'Q1', 'Suburbia', 'Subway', 'Tanker'],
					datasets: data
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
		});
	}
}
