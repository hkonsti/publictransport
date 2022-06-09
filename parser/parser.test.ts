import {Parser} from "./parser";
import type {Calendar, Route, Stop, StopTime, Trip} from "./schema";

const BASE = "./parser/testfiles"

const CALENDAR_TEST = `${BASE}/calendar.txt`;
const STOPS_TEST = `${BASE}/stops.txt`;
const STOP_TIMES_TEST = `${BASE}/stop_times.txt`;
const TRIPS_TEST = `${BASE}/trips.txt`;
const ROUTES_TEST = `${BASE}/routes.txt`;
const INVALID_TEST = `${BASE}/invalid.txt`;
const NO_FILE = `${BASE}/.txt`;

test("Parsing a Calendar table.", async () => {
    let calendar: Calendar | undefined;
    const callback = (res: Calendar) => {
        calendar = res;
    }

    await Parser.readCalendar(CALENDAR_TEST, callback);

    expect(calendar).toEqual({
        service_id: 1,
        calendar: [false, true, false, false, true, false, false],
    })
});

test("Parsing a Stops table.", async () => {
    let stop: Stop | undefined;
    const callback = (res: Stop) => {
        stop = res;
    }

    await Parser.readStops(STOPS_TEST, callback);

    expect(stop).toEqual({
        id: 100101,
        name: "Aachen, Bushof",
    })
});

test("Parsing a Stop Times table.", async () => {
    let stopTime: StopTime | undefined;
    const callback = (res: StopTime) => {
        stopTime = res;
    }

    await Parser.readStopTimes(STOP_TIMES_TEST, callback);

    expect(stopTime).toEqual({
        stopId: 545301,
        tripId: 218276779,
        arrival: "13:35:00",
        departure: "13:35:00",
    })
});

test("Parsing a Trips table.", async () => {
    let trip: Trip | undefined;
    const callback = (res: Trip) => {
        trip = res;
    }

    await Parser.readTrips(TRIPS_TEST, callback);

    expect(trip).toEqual({
        route_id: "411511_704",
        service_id: 1,
        trip_id: 218276779,
    })
});

test("Parsing a Routes table.", async () => {
    let route: Route | undefined;
    const callback = (res: Route) => {
        route = res;
    }

    await Parser.readRoutes(ROUTES_TEST, callback);

    expect(route).toEqual({
        id: "411511_704",
        name: "88V",
    })
});

test("Parsing an invalid file.", async () => {
    let calendar = false;
    let stops = false;
    let stopTimes = false;
    let trips = false;
    let routes = false

    await Parser.readCalendar(INVALID_TEST, ()=>{}).catch(_ => {calendar = true});
    await Parser.readStops(INVALID_TEST, ()=>{}).catch(_ => {stops = true});
    await Parser.readStopTimes(INVALID_TEST, ()=>{}).catch(_ => {stopTimes = true});
    await Parser.readTrips(INVALID_TEST, ()=>{}).catch(_ => {trips = true});
    await Parser.readRoutes(INVALID_TEST, ()=>{}).catch(_ => {routes = true});

    expect(calendar).toBe(true);
    expect(stops).toBe(true);
    expect(stopTimes).toBe(true);
    expect(trips).toBe(true);
    expect(routes).toBe(true);
});

test("Parsing a file that isn't there.", async () => {
    let fails = false;
    await Parser.readCalendar(NO_FILE, ()=>{}).catch(_ => {fails= true});
    expect(fails).toBe(true);
});
