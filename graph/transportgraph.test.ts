import {Transportation, TransportationType, TransportGraph} from "./transportgraph";
import type {Id} from "./timegraph";

test("Test transport graph", () => {
    const t = new TransportGraph();

    t.addTimeVertex(1);
    t.addTimeVertex(2);
    t.addTimeVertex(3);

    expect(t.getNumberOfVertices()).toBe(3);

    const bus1: Transportation = {name: "1A", type: TransportationType.TRANSPORT};
    const bus2: Transportation = {name: "2A", type: TransportationType.TRANSPORT};
    expect(t.addEdge(`${1}:1`, {to: `${2}:5`, transportation: bus1})).toBe(true);
    expect(t.addEdge(`${2}:6`, {to: `${3}:25`, transportation: bus2})).toBe(true);
});

test("Test convertPath", () => {
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

    let path: Id[] = ["1:0", "1:5", "2:10", "2:12", "3:15"];
    let converted = t.convertPath(path);
    expect(converted[1]).toEqual({from: "1:5", to: "2:10", transport: transportation});

    path = [];
    converted = t.convertPath(path);
    expect(converted).toEqual([]);

    path = ["1:1", "1:0"];
    expect(() => t.convertPath(path)).toThrow("Edge doesn't exist when converting path.");
});
