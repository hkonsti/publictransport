import { Reader } from "./reader";
import type {Calendar, Route, Stop, StopTime, Trip} from "./schema";

export class Parser {

	private static invalidFileFormatError = () => new Error("Invalid File Format");

	private static async readIntoSchema<T>(path: string, callback: (t: T) => void, convert: (arr: string[]) => T) {
		const transform = function(line: string[]) {
			callback(convert(line));
		}

		await Reader.readLines(path, transform);
	}

	private static convertLineToStop(split: string[]): Stop {
		if (split[0] === undefined || split[2] === undefined) {
			throw Parser.invalidFileFormatError();
		}

		return {
			id: parseInt(split[0]),
			name: split[2],
		}
	}

	/**
	 * Converts each line of the provided file into a Stop object and calls the callback with it.
	 */
	public static async readStops(path: string, callback: (stop: Stop) => void): Promise<void> {
		await Parser.readIntoSchema<Stop>(path, callback, Parser.convertLineToStop);
	}

	private static convertLineToStopTime(split: string[]): StopTime {
		if (split.length < 8) {
			throw Parser.invalidFileFormatError();
		}

		return {
			tripId: parseInt(split[0]!),
			stopId: parseInt(split[3]!),
			arrival: split[1]!,
			departure: split[2]!,
		}
	}

	/**
	 * Converts each line of the provided file into a StopTime object and calls the callback with it.
	 */
	public static async readStopTimes(path: string, callback: (stopTime: StopTime) => void): Promise<void> {
		await Parser.readIntoSchema<StopTime>(path, callback, Parser.convertLineToStopTime);
	}

	private static convertLineToCalendar(split: string[]): Calendar {
		if (split.length < 10) {
			throw Parser.invalidFileFormatError();
		}

		const calendar: [boolean, boolean, boolean, boolean, boolean, boolean, boolean] =
			[false, false, false, false, false, false, false];
		for (let i = 1; i < 8; i++) {
			calendar[i - 1] = split[i] === "1";
		}

		return {
			service_id: parseInt(split[0]!),
			calendar,
		}
	}

	/**
	 * Converts each line of the provided file into a Calendar object and calls the callback with it.
	 */
	public static async readCalendar(path: string, callback: (stop: Calendar) => void): Promise<void> {
		await Parser.readIntoSchema<Calendar>(path, callback, Parser.convertLineToCalendar);
	}

	private static convertLineToTrip(split: string[]): Trip {
		if (split.length < 10) {
			throw this.invalidFileFormatError();
		}

		return {
			route_id: split[0]!,
			service_id: parseInt(split[1]!),
			trip_id: parseInt(split[2]!),
		}
	}

	/**
	 * Converts each line of the provided file into a Trip object and calls the callback with it.
	 */
	public static async readTrips(path: string, callback: (entry: Trip) => void): Promise<void> {
		return Parser.readIntoSchema<Trip>(path, callback, Parser.convertLineToTrip);
	}

	private static convertLineToRoute(split: string[]): Route {
		if (split.length < 8) {
			throw Parser.invalidFileFormatError();
		}

		return {
			id: split[0]!,
			name: split[2]!,
		};
	}

	/**
	 * Converts each line of the provided file into a Route object and calls the callback with it.
	 */
	public static async readRoutes(path: string, callback: (entry: Route) => void): Promise<void> {
		return Parser.readIntoSchema<Route>(path, callback, Parser.convertLineToRoute);
	}
}