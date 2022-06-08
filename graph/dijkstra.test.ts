import {Dijkstra} from "./dijkstra";
import {TransportGraph} from "./transportgraph";

test("Test Dijkstra's algorithm on TransportGraph", () => {
    const t = new TransportGraph();

    const misereorId = 1;
    const bushofId = 2;
    const talbotId = 3;

    t.addTimeVertex(misereorId);
    t.addTimeVertex(bushofId);
    t.addTimeVertex(talbotId);

    const transportation = {name: "Bus1"};
    t.addEdge(`${misereorId}:5`, {to: `${bushofId}:10`, transportation});
    t.addEdge(`${bushofId}:12`, {to: `${talbotId}:15`, transportation});

    const path = Dijkstra.findShortestPath(t, `${misereorId}:1`, talbotId);
    expect(path).toEqual(["1:1", "1:2", "1:3", "1:4", "1:5", "2:10", "2:11", "2:12", "3:15"]);
});

test("Test Dijkstra's algorithm when maxdepth is exceeded", () => {
    const t = new TransportGraph();

    const misereorId = 1;
    const bushofId = 2;
    const talbotId = 3;

    t.addTimeVertex(misereorId);
    t.addTimeVertex(bushofId);
    t.addTimeVertex(talbotId);

    const transportation = {name: "Bus1"};
    t.addEdge(`${misereorId}:5`, {to: `${bushofId}:10`, transportation});

    expect(() => Dijkstra.findShortestPath(t, `${misereorId}:1`, talbotId))
        .toThrow("Max depth exceeded. Couldn't find a route.");
});

test("Test Dijkstra's algorithm when there is no route", () => {
    const t = new TransportGraph();

    const misereorId = 1;
    const talbotId = 2;

    t.addTimeVertex(misereorId);
    t.addTimeVertex(talbotId);

    const path = Dijkstra.findShortestPath(t, `${misereorId}:1`, talbotId);
    expect(path).toEqual([]);
});