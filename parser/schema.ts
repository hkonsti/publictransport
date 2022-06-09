
export interface Stop {
    id: number;
    name: string;
}

export interface Route {
    id: number;
    name: number; // Using short name
}

export interface StopTime {
    tripId: number;
    stopId: number;
    arrival: number;
    departure: number;
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
