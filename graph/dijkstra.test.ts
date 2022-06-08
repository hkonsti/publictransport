import {Dijkstra} from "./dijkstra";
import {TransportGraph} from "./transportgraph";

test("Add stops to a TransportGraph", () => {
    const t = new TransportGraph();

    const misereorId = 1;
    const bushofId = 2;
    const talbotId = 3;

    t.addTimeVertex(misereorId);
    t.addTimeVertex(bushofId);
    t.addTimeVertex(talbotId);

    const transportation = {name: "Bus1"};
    t.addEdge(`${misereorId}:5`, {to: `${bushofId}:10`, transportation});

    console.log(Dijkstra.findShortestPath(t, `${misereorId}:1`, bushofId));
});