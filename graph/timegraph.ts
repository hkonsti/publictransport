import {Graph, PointTo} from "./graph";

// Fromat:   	 locationId: timeStamp
export type Id = `${number}:${number}`

class Times {

	// Maps from location id to time stamps.
	private times = new Map<number, number[]>();

	public addAndGetPosition(id: Id): [Id, Id] {
		const split = id.split(":");
		const locationId = parseInt(split[0]!);
		const index = this.sortedInsert(locationId, parseInt(split[1]!));

		const list = this.times.get(locationId)!;
		let left = index-1;
		if (left < 0) {
			left = list.length-1;
		}
		let right = index+1;
		if (right >= list.length) {
			right = 0;
		}

		const leftId: Id = `${locationId}:${list[left]!}`;
		const rightId: Id = `${locationId}:${list[right]!}`;
		return [leftId, rightId];
	}

	/**
	 * Inserts into a sorted list.
	 * @returns Index of where insert was made.
	 */
	private sortedInsert(locationId: number, timeStamp: number): number {
		if (!this.times.has(locationId)) {
			this.times.set(locationId, []);
		}

		const list = this.times.get(locationId)!;
		
		// Can be sped up with binary search.
		let inserted = false;
		let i = 0;
		while (i <= list.length && !inserted) {
			if (list[i] === undefined || list[i]! > timeStamp) {
				list.splice(i, 0, timeStamp);
				inserted = true;
			}
			i++;
		}

		return i-1;
	}
}

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

	/**
	 *  Tracks which times have been created for which locations.
	 * 	Array is sorted.
	 */ 
	private times: Times;

	constructor(timeSteps: number, createWaitingEdge: (id: Id) => Edge) {
		super();
		this.timeSteps = timeSteps;
		this.createWaitingEdge = createWaitingEdge;

		this.times = new Times();
	}

	addTimeVertex(id: number) {
		this.addVertex(`${id}:${0}`);
		this.addEdge(`${id}:${0}`, this.createWaitingEdge(`${id}:${0}`));
		this.times.addAndGetPosition(`${id}:${0}`);
	}

	private lazyCreateVertex(id: Id) {
		const split = id.split(":");
		const locationId = parseInt(split[0]!);
		const timeStamp = parseInt(split[1]!);

		if (this.timeSteps < timeStamp) {
			throw new Error("Timestamp is out of range.");
		}

		// Should always exist.
		const zeroLocation: Id = `${locationId}:${0}`;
		if (!this.vertexExists(zeroLocation)) {
			throw new Error("Zero-Vertex doesn't exist.");
		}

		const [left, right] = this.times.addAndGetPosition(id);

		this.addVertex(id);

		const edge = this.getEdge(left, right);
		if (!edge) {
			throw new Error(`Edge doesn't exist. Left: ${left}, Right: ${right}`);
		}

		edge.to = id;
		this.addEdge(id, this.createWaitingEdge(right));
	}

	override addEdge(id: Id, edge: Edge) {
		if (!this.vertexExists(id)) {
			this.lazyCreateVertex(id);
		}

		if (!this.vertexExists(edge.to)) {
			this.lazyCreateVertex(edge.to);
		}

		return super.addEdge(id, edge);
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