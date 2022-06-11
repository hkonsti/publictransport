import {Transportation, TransportationType, TransportGraph} from "../graph/transportgraph";
import {Parser} from "../parser/parser";
import {TimeConverter} from "../parser/timeconverter";

import type {Calendar, Stop, Trip, Route, StopTime} from "../parser/schema";
import type {Id} from "../graph/timegraph";

export class DataStore {

	dataFolder: string;

	public t: TransportGraph;

	public calendar: Map<number, Calendar>;
	public stops: Map<number, Stop>;
	public trips: Map<number, Trip>;
	public routes: Map<string , Route>;

	constructor(dataFolder: string) {
		this.dataFolder = dataFolder;

		this.t = new TransportGraph();

		this.calendar = new Map<number, Calendar>();
		this.stops = new Map<number, Stop>();
		this.trips = new Map<number, Trip>();
		this.routes = new Map<string , Route>();
	}

	public async intialize() {
		await this.time(this.initalizeStops.bind(this), "Loading stops and adding vertices");
		await this.time(this.initializeCalendar.bind(this), "Loading calendar");
		await this.time(this.initializeTrips.bind(this), "Loading trips");
		await this.time(this.initializeRoutes.bind(this), "Loading routes");
		await this.time(this.initializeStopTimes.bind(this), "Loading stop times and adding edges");
	}

	private async time(func: () => any, title: string) {
		const time = Date.now();
		await func();
		console.log(`${title} took ${Date.now()-time}ms.`);
	}

	private async initalizeStops() {
		const stopCallback = (stop: Stop) => {
			this.stops.set(stop.id, stop);
			this.t.addTimeVertex(stop.id);
		}
		await Parser.readStops(`${this.dataFolder}/stops.txt`, stopCallback);
	}

	private async initializeCalendar() {
		const calendarCallback = (calendar: Calendar) => {
			this.calendar.set(calendar.service_id, calendar);
		}
		await Parser.readCalendar(`${this.dataFolder}/calendar.txt`, calendarCallback);
	}

	private async initializeTrips() {
		const tripCallback = (trip: Trip) => {
			this.trips.set(trip.trip_id, trip);
		}
		await Parser.readTrips(`${this.dataFolder}/trips.txt`, tripCallback);
	}

	private async initializeRoutes() {
		const routeCallback = (route: Route) => {
			this.routes.set(route.id, route);
		}
		await Parser.readRoutes(`${this.dataFolder}/routes.txt`, routeCallback);
	}

	private async initializeStopTimes() {
		let before: StopTime | undefined = undefined;
		const stopTimeCallback = (stopTime: StopTime) => {
			if (!before || before.tripId !== stopTime.tripId) {
				before = stopTime;
				return;
			}

			const trip = this.trips.get(stopTime.tripId);

			const transportation: Transportation = {
				name: this.routes.get(trip!.route_id)!.name,
				type: TransportationType.TRANSPORT,
			}

			const service_id = trip!.service_id;
			const service = this.calendar.get(service_id)!;

			for (let i = 0; i < service.calendar.length; i++) {
				if (service.calendar[i]) {
					const fromTime = TimeConverter.convert(i, before.departure);
					let toTime = TimeConverter.convert(i, stopTime.departure);
					if (toTime < fromTime) {
						toTime = TimeConverter.convert(i+1, stopTime.departure);
					}

					const fromVertex: Id = `${before.stopId}:${fromTime}`;
					const toVertex: Id = `${stopTime.stopId}:${toTime}`;

					this.t.addEdge(fromVertex, { to: toVertex, transportation });
				}
			}

			before = stopTime;
		}

		await Parser.readStopTimes(`${this.dataFolder}/stop_times.txt`, stopTimeCallback);
	}

}
