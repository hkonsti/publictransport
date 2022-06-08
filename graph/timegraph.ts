import {Graph, PointTo} from "./graph";

// Fromat:   stopId : timeStamp
export type Id = `${number}:${number}`

/**
 * TimeGraph represents a graph that has multiple vertices for one
 * location, representing different positions in time.
 * 
 * For example would there be vertices for bus stop A at 6:00, 6:01,
 * 6:02, ...
 * 
 * Vertices for one location are always connected to the one in the
 * next minute to represent waiting at that location for one minute.
 */
export class TimeGraph<Edge extends PointTo<Id>> extends Graph<Id, Edge> {
	private timeSteps: number;
	private createWaitingEdge: (id: Id) => Edge;

	constructor(timeSteps: number, createWaitingEdge: (id: Id) => Edge) {
		super();
		this.timeSteps = timeSteps;
		this.createWaitingEdge = createWaitingEdge;
	}

	addTimeVertex(id: number) {
		this.addVertex(`${id}:${0}`);

		for (let i = 1; i < this.timeSteps; i++) {
			this.addVertex(`${id}:${i}`);
			this.addEdge(`${id}:${i-1}`, this.createWaitingEdge(`${id}:${i}`));
		}

		this.addEdge(`${id}:${this.timeSteps-1}`, this.createWaitingEdge(`${id}:${0}`));
	}

	public static isSameVertexId(id: Id, number: number): boolean {
		return id.split(":")[0] === number.toString();
	}

	public static getTime(id: Id): number {
		return parseInt(id.split(":")[1]!)
	}

	public static getTimeDifference(start: Id, end: Id) {
		return TimeGraph.getTime(end) - TimeGraph.getTime(start);
	}
}