import * as fs from "fs";

/**
 * PointTo objects point to other objects and can be extended to hold more information.
 * Used in the adjacency lists of the Graph class.
 */
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
 * Edges is a data store for adjacency lists used in the Graph class.
 * 
 * There is a lot of optimization possible by keeping the lists sorted.
 * For now it wasn't worth the effort as nodes in transportation graphs have only very few neighbors.
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

		if (!this.edges.has(from)) {
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
			if (e.to === to) {
				return e;
			}
		}

		return undefined;
	}

	public getNeighbors(id: Vertex): Edge[] {
		return (this.edges.get(id) || []);
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

	protected vertexExists(id: Vertex): boolean {
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
		if (!this.vertexExists(from) || !this.vertexExists(edge.to)) {
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

	public getNeighbors(vertex: Vertex): Edge[] {
		if (!this.vertexExists(vertex)) {
			throw new Error("Vertex doesn't exist in Graph. Vertex: "+vertex);
		}

		return this.edges.getNeighbors(vertex);
	}

	/* istanbul ignore next */
	public async dumpToGraphML(path: string) {
		const header = `<?xml version="1.0" encoding="UTF-8"?>
		<graphml xmlns="http://graphml.graphdrawing.org/xmlns"
			xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
			xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns
			 http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">
		  <graph id="G" edgedefault="directed">`

		const footer = `</graph></graphml>`

		let body = "";

		for (const vertex of this.verticies.keys()) {
			body += `<node id="${vertex}" />`;
		}

		let id = 0;
		for (const vertex of this.verticies.keys()) {
			const neighbors = this.getNeighbors(vertex);
			for (const n of neighbors) {
				body += `<edge id="${id}" source="${vertex}" target="${n.to}" />`;
				id++;
			}
		}

		await fs.promises.writeFile(path, (header+body+footer));
	}
}