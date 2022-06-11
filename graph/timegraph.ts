import {Graph, PointTo} from "./graph";

/**
 * TimeGraph represents a graph that has multiple vertices for one
 * location, representing different positions in time.
 * 
 * For example could there be vertices for a location at 6:00, 6:03,
 * 6:10, ...
 * 
 * Vertices for one location are always connected to themselves in the
 * future to represent waiting at that location until movement is 
 * possible again.
 * 
 * Location A
 * 5:55 -> 6:11 -> 6:30 -> ... -> 5:55
 *			^
 * 			|
 * 6:00 -> 6:03 -> 6:10 -> ... -> 6:00
 * Location B
 * 
 * The above graph shows two locations with the possibility of leaving B at 
 * 6:03 and arriving at A at 6:11.
 * 
 * For simplification, in this graph, time is a closed loop and the last 
 * timestep of each location connects to the first one.
 *
 * Creating Location C and adding 1:10.
 *  ┍> 0:00 ┑     ┍> 0:00  -> 1:10 ┑
 * 	|       | ->  |                |
 *  ┕-------┚     ┕----------------┚
 */


/**
 * Vertex Id Format:
 * 
 * locationId:timeStamp
 */
export type Id = `${number}:${number}`

/**
 * Tracks which times already exist for a location. Returns times left and right 
 * so the waiting edges can be connected accordingly.
 */
class Times {

	// Maps from location id to time stamps.
	private times = new Map<number, number[]>();

	public addAndGetPosition(id: Id): [Id, Id] {
		const split = id.split(":");
		const locationId = parseInt(split[0]!);
		const index = this.sortedInsert(locationId, parseInt(split[1]!));

		const list = this.times.get(locationId)!;
		let left = index - 1;
		if (left < 0) {
			left = list.length - 1;
		}
		let right = index + 1;
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

		return i - 1;
	}
}

export class TimeGraph<Edge extends PointTo<Id>> extends Graph<Id, Edge> {
	/**
	 * How many time steps does the closed time loop have.
	 */
	private timeSteps: number;
	private createWaitingEdge: (id: Id) => Edge;

	/**
	 *  Tracks which times have been created for which locations.
	 */
	private times: Times;

	constructor(timeSteps: number, createWaitingEdge: (id: Id) => Edge) {
		super();
		this.timeSteps = timeSteps;
		this.createWaitingEdge = createWaitingEdge;

		this.times = new Times();
	}

	/**
	 * Adds a vertex at the zero time step and connects it to ifself 
	 * using a waiting edge.
	 * @param id 
	 */
	addTimeVertex(id: number) {
		super.addVertex(`${id}:${0}`);
		this.addEdge(`${id}:${0}`, this.createWaitingEdge(`${id}:${0}`));
		this.times.addAndGetPosition(`${id}:${0}`);
	}

	/**
	 * Can only add new times for already existing locations.
	 * @param id - Contains location id and time.
	 * @returns True of successful.
	 */
	public override addVertex(id: Id): boolean {
		const split = id.split(":");
		const locationId = parseInt(split[0]!);
		const timeStamp = parseInt(split[1]!);

		if (this.timeSteps < timeStamp) {
			throw new Error("Timestamp is out of range.");
		}

		const zeroLocation: Id = `${locationId}:${0}`;
		if (!this.vertexExists(zeroLocation)) {
			throw new Error("Zero-Vertex doesn't exist.");
		}

		const [left, right] = this.times.addAndGetPosition(id);

		super.addVertex(id);

		const edge = this.getEdge(left, right);
		edge!.to = id;
		this.addEdge(id, this.createWaitingEdge(right));

		return true;
	}

	/**
	 * Creates an edge between two vertices. If vertices
	 * for the two specific times don't exist yet, they 
	 * are created. 
	 * 
	 * The location needs to already exist in the graph.
	 * @param id 
	 * @param edge 
	 * @returns 
	 */
	public override addEdge(id: Id, edge: Edge) {
		if (!this.vertexExists(id)) {
			this.addVertex(id);
		}

		if (!this.vertexExists(edge.to)) {
			this.addVertex(edge.to);
		}

		return super.addEdge(id, edge);
	}

	/**
	 * Returns neighbors of a vertex.
	 * If the specific time doesn't exist yet, it is created.
	 * 
	 * The location needs to already exist in the graph.
	 * @param vertex 
	 * @returns 
	 */
	public override getNeighbors(vertex: `${number}:${number}`): Edge[] {
		if (!this.vertexExists(vertex)) {
			this.addVertex(vertex);
		}
		
		return super.getNeighbors(vertex);
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