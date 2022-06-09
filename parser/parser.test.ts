import {Parser} from "./parser";
import type {Calendar, Stop, Trip} from "./schema";

const BASE = "./parser/testfiles/"

const CALENDAR_TEST = `${BASE}/calendar.txt`;
const STOPS_TEST = `${BASE}/stops.txt`;
const TRIPS_TEST = `${BASE}/trips.txt`;
const INVALID_TEST = `${BASE}/invalid.txt`;

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

test("Parsing an invalid file.", async () => {
    let calendar = false;
    let stops = false;
    let trips = false;

    await Parser.readCalendar(INVALID_TEST, ()=>{}).catch(_ => {calendar = true});
    await Parser.readStops(INVALID_TEST, ()=>{}).catch(_ => {stops = true});
    await Parser.readTrips(INVALID_TEST, ()=>{}).catch(_ => {trips = true});

    expect(calendar).toBe(true);
    expect(stops).toBe(true);
    expect(trips).toBe(true);
});

