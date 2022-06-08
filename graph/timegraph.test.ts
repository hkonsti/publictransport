import {TimeGraph, Id} from "./timegraph";
import type {PointTo} from "./graph";

const MINUTES = 60 * 24 * 7; // Minutes in a week.
const createWaitingEdge = (id: Id) => {return {to: id}};

test("Add stops to a TransportGraph", () => {
    const t = new TimeGraph<PointTo<Id>>(MINUTES, createWaitingEdge);

    const misereorId = 1;
    const bushofId = 2;
    const talbotId = 3;

    t.addTimeVertex(misereorId);
    t.addTimeVertex(bushofId);
    t.addTimeVertex(talbotId);

    expect(t.getNumberOfVertices()).toBe(MINUTES * 3);
    expect(t.getNeighbors(`${misereorId}:${MINUTES - 1}`)[0]).toEqual(`${misereorId}:0`);
});