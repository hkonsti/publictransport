import {Dijkstra} from "./dijkstra";
import {Vertex, TimeGraph} from "./timegraph";

const MINUTES = 60 * 24 * 7; // Minutes in a week.

test("Add stops to a TransportGraph", () => {
    const t = new TimeGraph(MINUTES);

    const misereorId = 1;
    const bushofId = 2;
    const talbotId = 3;

    t.addTimeVertex(new Vertex(misereorId, "Misereor"));
    t.addTimeVertex(new Vertex(bushofId, "Bushof"));
    t.addTimeVertex(new Vertex(talbotId, "Talbot"));

    t.addEdge(`${misereorId}:5`, `${bushofId}:10`);

    console.log(Dijkstra.findShortestPath(t, `${misereorId}:1`, bushofId));
});