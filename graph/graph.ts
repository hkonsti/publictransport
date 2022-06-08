
export class PointTo<T> {
	to: T;

	constructor(to: T) {
		this.to = to;
	}

	static toArray<T>(p: PointTo<T>[] | undefined): T[] {
		const res: T[] = [];
		if (!p) {
			return res;
		}

		for (const elem of p) {
			res.push(elem.to);
		}
		return res;
	}
}

/**
 * There is a lot of optimization possible by keeping the id lists sorted.
 * Not going to bother for now though as the number of neighbors is likely to remain very small.
 */
class Edges<Vertex, Edge extends PointTo<Vertex>> {

	private edges: Map<Vertex, Edge[]>

	constructor() {
		this.edges = new Map<Vertex, Edge[]>();
	}

	private edgeExists(from: Vertex, edge: Edge): boolean {
		if (!this.edges.has(from)) {
			return false;
		}

		return PointTo.toArray(this.edges.get(from)).includes(edge.to);
	}

	public addEdge(from: Vertex, edge: Edge): boolean {
		if (this.edgeExists(from, edge)) {
			return false;
		}

		if (!this.edges.has(from)){
			this.edges.set(from, []);
		}

		this.edges.get(from)!.push(edge);
		return true;
	}

	public getEdge(from: Vertex, to: Vertex): Edge | undefined {
		const edges = this.edges.get(from);
		if (!edges) {
			return undefined;
		}

		for (const e of edges) {
			if (e.to === to)  {
				return e;
			}
		}

		return undefined;
	}

	public getNeighbors(id: Vertex): Vertex[] {
		return PointTo.toArray(this.edges.get(id)).sort();
	}
}

/**
 * Implementation of a directed graph with unweighted edges.
 */
export class Graph<Vertex, Edge extends PointTo<Vertex>> {
	private verticies: Map<Vertex, boolean>;
	private vertexCount: number;

	private edges: Edges<Vertex, Edge>;

    constructor() {
        this.verticies = new Map<Vertex, boolean>();
		this.vertexCount = 0;
		this.edges = new Edges();
    }

	private vertexExists(id: Vertex): boolean {
		return this.verticies.has(id);
	}

    public addVertex(id: Vertex): boolean {
		if (this.verticies.has(id)) {
			return false;
		}

        this.verticies.set(id, true);
		this.vertexCount++;
		return true;
    }

	public addEdge(from: Vertex, edge: Edge): boolean {
		if (!this.vertexExists(from) || !this.vertexExists(edge.to))  {
			return false;
		}

		return this.edges.addEdge(from, edge);
	}

	public getEdge(from: Vertex, to: Vertex): Edge | undefined {
		return this.edges.getEdge(from, to);
	}

	public getVertices(): IterableIterator<Vertex> {
		return this.verticies.keys();
	}

	public getNumberOfVertices(): number {
		return this.vertexCount;
	}

	public getNeighbors(vertex: Vertex): Vertex[] {
		if (!this.vertexExists(vertex)) {
			throw new Error("Vertex doesn't exist in Graph.");
		}

		return this.edges.getNeighbors(vertex);
	}
}