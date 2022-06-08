import {Graph} from "./graph";

export class Stop {
	id: number;
	name: string;

	constructor(id: number, name: string) {
		this.id = id;
		this.name = name;
	}
}

class StopAtTime {
	time: number;
	stop: Stop;

	constructor(time: number, stop: Stop) {
		this.time = time;
		this.stop = stop;
	}

	get id(): Id {
		return `${this.stop.id}:${this.time}`;
	}
}

// Fromat:   stopId : timeStamp
export type Id = `${number}:${number}`

/**
 * Different Stops are connected by buses on different times of the day/ week. 
 * This means that for each time step, and bus stop, we need a distinct vertex 
 * in the graph.
 * 
 * In this model, there is just one week that wraps around itself so
 * 60*24*7 vertices per stop, where the vertices of the last minute connect to the ones of
 * the first.
 */
export class TransportGraph extends Graph<Id, StopAtTime> {
	private readonly MINUTES = 60 * 24 * 7

	private stops: Stop[];

	constructor() {
		super();
		this.stops = [];
	}

	addStop(stop: Stop) {
		this.stops.push(stop);

		this.addVertex(`${stop.id}:${0}`, new StopAtTime(0, stop));

		for (let i = 1; i < this.MINUTES; i++) {
			this.addVertex(`${stop.id}:${i}`, new StopAtTime(i, stop));
			this.addEdge(`${stop.id}:${i-1}`, `${stop.id}:${i}`);
		}

		this.addEdge(`${stop.id}:${this.MINUTES-1}`, `${stop.id}:${0}`);
	}
}