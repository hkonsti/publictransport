import {Graph} from "./graph";

export class Vertex {
	id: number;
	name: string;

	constructor(id: number, name: string) {
		this.id = id;
		this.name = name;
	}
}

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
export class TimeGraph extends Graph<Id> {
	private vertices: Map<Vertex, Boolean>;
	private timeSteps: number;

	constructor(timeSteps: number) {
		super();
		this.timeSteps = timeSteps;
		this.vertices = new Map<Vertex, Boolean>();
	}

	addTimeVertex(vertex: Vertex) {
		this.vertices.set(vertex, true);

		this.addVertex(`${vertex.id}:${0}`);

		for (let i = 1; i < this.timeSteps; i++) {
			this.addVertex(`${vertex.id}:${i}`);
			this.addEdge(`${vertex.id}:${i-1}`, `${vertex.id}:${i}`);
		}

		this.addEdge(`${vertex.id}:${this.timeSteps-1}`, `${vertex.id}:${0}`);
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