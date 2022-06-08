import {Transportation, TransportGraph} from "./transportgraph";

const MINUTES = 60 * 24 * 7; // Minutes in a week.

test("Test transport graph", () => {
    const t = new TransportGraph();

    t.addTimeVertex(1);
    t.addTimeVertex(2);
    t.addTimeVertex(3);

    expect(t.getNumberOfVertices()).toBe(3*MINUTES);

    const bus1: Transportation = {name: "1A"};
    const bus2: Transportation = {name: "2A"};
    expect(t.addEdge(`${1}:1`, {to: `${2}:5`, transportation: bus1})).toBe(true);
    expect(t.addEdge(`${2}:6`, {to: `${3}:25`, transportation: bus2})).toBe(true);
});