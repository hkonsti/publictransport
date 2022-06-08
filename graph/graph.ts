
/**
 * There is a lot of optimization possible by keeping the id lists sorted.
 * Not going to bother for now though as the number of neighbors is likely to remain very small.
 */
class Edges<Id> {

	private edges: Map<Id, Id[]>

	constructor() {
		this.edges = new Map<Id, Id[]>();
	}

	private edgeExists(from: Id, to: Id): boolean {
		if (!this.edges.has(from)) {
			return false;
		}

		return this.edges.get(from)!.includes(to);
	}

	public addEdge(from: Id, to: Id): boolean {
		if (this.edgeExists(from, to)) {
			return false;
		}

		if (!this.edges.has(from)){
			this.edges.set(from, []);
		}

		this.edges.get(from)!.push(to);
		return true;
	}

	public getNeighbors(id: Id): Id[] {
		return (this.edges.get(id) || []).sort();
	}
}

/**
 * Implementation of a directed graph with unweighted edges.
 */
export class Graph<Id> {
	private verticies: Map<Id, boolean>;
	private vertexCount: number;

	private edges: Edges<Id>;

    constructor() {
        this.verticies = new Map<Id, boolean>();
		this.vertexCount = 0;
		this.edges = new Edges();
    }

	private vertexExists(id: Id): boolean {
		return this.verticies.has(id);
	}

    public addVertex(id: Id): boolean {
		if (this.verticies.has(id)) {
			return false;
		}

        this.verticies.set(id, true);
		this.vertexCount++;
		return true;
    }

	public addEdge(from: Id, to: Id): boolean {
		if (!this.vertexExists(from) || !this.vertexExists(to))  {
			return false;
		}

		return this.edges.addEdge(from, to);
	}

	public getVertices(): IterableIterator<Id> {
		return this.verticies.keys();
	}

	public getNumberOfVertices(): number {
		return this.vertexCount;
	}

	public getNeighbors(id: Id): Id[] {
		if (!this.vertexExists(id)) {
			throw new Error("Vertex doesn't exist in Graph.");
		}

		return this.edges.getNeighbors(id);
	}
}