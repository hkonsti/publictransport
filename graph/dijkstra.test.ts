import {Dijkstra} from "./dijkstra";
import {TransportationType, TransportGraph} from "./transportgraph";

test("Test Dijkstra's algorithm on TransportGraph", () => {
	const t = new TransportGraph();

	const misereorId = 1;
	const bushofId = 2;
	const talbotId = 3;

	t.addTimeVertex(misereorId);
	t.addTimeVertex(bushofId);
	t.addTimeVertex(talbotId);

	const transportation = {name: "Bus1", type: TransportationType.TRANSPORT};
	t.addEdge(`${misereorId}:5`, {to: `${bushofId}:10`, transportation});
	t.addEdge(`${bushofId}:12`, {to: `${talbotId}:15`, transportation});

	const path = Dijkstra.findShortestPath(t, `${misereorId}:0`, talbotId);
	expect(path).toEqual(["1:0", "1:5", "2:10", "2:12", "3:15"]);
});

test("Test Dijkstra's algorithm when maxdepth is exceeded", () => {
	const t = new TransportGraph();

	const misereorId = 1;
	const bushofId = 2;
	const talbotId = 3;

	t.addTimeVertex(misereorId);
	t.addTimeVertex(bushofId);
	t.addTimeVertex(talbotId);

	const transportation = {name: "Bus1", type: TransportationType.TRANSPORT};
	t.addEdge(`${misereorId}:5`, {to: `${bushofId}:10`, transportation});

	expect(() => Dijkstra.findShortestPath(t, `${misereorId}:0`, talbotId, 1))
		.toThrow("Max depth exceeded. Couldn't find a route.");
});

test("Test Dijkstra's algorithm when there is no route", () => {
	const t = new TransportGraph();

	const misereorId = 1;
	const talbotId = 2;

	t.addTimeVertex(misereorId);
	t.addTimeVertex(talbotId);

	const path = Dijkstra.findShortestPath(t, `${misereorId}:0`, talbotId);
	expect(path).toEqual([]);
});

test("Test Dijkstra's algorithm with hopping on/ off rules", () => {
	const t = new TransportGraph();

	const stop1 = 1;
	const stop2 = 2;
	const stop3 = 3;

	t.addTimeVertex(stop1);
	t.addTimeVertex(stop2);
	t.addTimeVertex(stop3);

	const transportation = {name: "Bus1", type: TransportationType.TRANSPORT};
	t.addEdge(`${stop1}:${0}`, {to: `${stop2}:${1}`, transportation});
	t.addEdge(`${stop2}:${1}`, {to: `${stop3}:${2}`, transportation});

	// Should not be possible when changing transport takes 1 min.
	const path = Dijkstra.findShortestPath(t, `${stop1}:${0}`, stop3);
	expect(path).toEqual([]);

	const t2 = new TransportGraph();

	t2.addTimeVertex(stop1);
	t2.addTimeVertex(stop2);
	t2.addTimeVertex(stop3);

	t.addEdge(`${stop1}:${0}`, {to: `${stop2}:${1}`, transportation});
	t.addEdge(`${stop2}:${2}`, {to: `${stop3}:${3}`, transportation});

	const path2 = Dijkstra.findShortestPath(t, `${stop1}:${0}`, stop3);
	expect(path2).toEqual(["1:0","2:1","2:2","3:3"]);
});