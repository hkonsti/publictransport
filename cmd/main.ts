import {Parser} from "../parser/parser";
import {Transportation, TransportationType, TransportGraph} from "../graph/transportgraph";
import {TimeConverter} from "../parser/timeconverter";
import {Dijkstra} from "../graph/dijkstra";

import type {Calendar, Route, Stop, StopTime, Trip} from "../parser/schema";
import type {Id} from "../graph/timegraph";

async function main(): Promise<void> {

	const t = new TransportGraph();

	// Stops
	let t1 = Date.now();
	const stopMap = new Map<number, string>();
	const stopCallback = (stop: Stop) => {
		stopMap.set(stop.id, stop.name);
		t.addTimeVertex(stop.id);
	}
	await Parser.readStops("./data/stops.txt", stopCallback);
	console.log(`Loaded stops in ${Date.now()-t1}ms`);

	// Calendar
	t1 = Date.now();
	const calendarMap = new Map<number, Calendar>();
	const calendarCallback = (calendar: Calendar) => {
		calendarMap.set(calendar.service_id, calendar);
	}
	await Parser.readCalendar("./data/calendar.txt", calendarCallback);
	console.log(`Loaded calendar in ${Date.now()-t1}ms`);

	// Trips
	t1 = Date.now();
	const tripMap = new Map<number, Trip>();
	const tripCallback = (trip: Trip) => {
		tripMap.set(trip.trip_id, trip);
	}
	await Parser.readTrips("./data/trips.txt", tripCallback);
	console.log(`Loaded trips in ${Date.now()-t1}ms`);

	// Routes
	t1 = Date.now();
	const routeMap = new Map<string, Route>();
	const routeCallback = (route: Route) => {
		routeMap.set(route.id, route);
	}
	await Parser.readRoutes("./data/routes.txt", routeCallback)
	console.log(`Loaded routes in ${Date.now()-t1}ms`);

	// Stop Time
	t1 = Date.now();
	let before: StopTime | undefined = undefined;
	const stopTimeCallback = (stopTime: StopTime) => {
		if (!before || before.tripId !== stopTime.tripId) {
			before = stopTime;
			return;
		}

		const trip = tripMap.get(stopTime.tripId);

		const transportation: Transportation = {
			name: routeMap.get(trip!.route_id)!.name,
			type: TransportationType.TRANSPORT,
		}

		const service_id = trip!.service_id;
		const service = calendarMap.get(service_id)!;

		for (let i = 0; i < service.calendar.length; i++) {
			if (service.calendar[i]) {
				const fromTime = TimeConverter.convert(i, before.departure);
				const toTime = TimeConverter.convert(i, stopTime.departure); // TODO: what if this is after midnight

				const fromVertex: Id = `${before.stopId}:${fromTime}`;
				const toVertex: Id = `${stopTime.stopId}:${toTime}`;

				t.addEdge(fromVertex, { to: toVertex, transportation });
			}
		}

		before = stopTime;
	}

	await Parser.readStopTimes("./data/stop_times.txt", stopTimeCallback);
	console.log(`Loaded stop times in ${Date.now()-t1}ms`);


	const start: Id = `${100870}:${1000}`; // Aachen Main Station Mon, 4:40 PM
	const goal = 440590; // Cologne Main Station

	t1 = Date.now();
	const path = Dijkstra.findShortestPath(t, start, goal);
	console.log(`Found connection in ${Date.now()-t1}ms`);
	const converted = t.convertPath(path);

	const readable = [];

	for (const e of converted) {
		const from = stopMap.get(parseInt(e.from.split(":")[0]!))!;
		const to = stopMap.get(parseInt(e.to.split(":")[0]!))!;
		readable.push({from, to, transport: e.transport.name, length: TransportGraph.getTimeDifference(e.from, e.to)});
	}

	console.log(readable);
}

main()