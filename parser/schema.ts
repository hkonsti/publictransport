
export interface Stop {
	id: number;
	name: string;
}

export interface Route {
	id: string;
	name: string; // Using short name
}

export interface StopTime {
	tripId: number;
	stopId: number;
	arrival: string;
	departure: string;
}

export interface Calendar {
	service_id: number;
	calendar: [boolean, boolean, boolean, boolean, boolean, boolean, boolean]
}

export interface Trip {
	route_id: string;
	service_id: number;
	trip_id: number;
}
