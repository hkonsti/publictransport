import {Stop, TransportGraph} from "./transportgraph";
    
const MINUTES = 10080 as const;

test("Add stops to a TransportGraph", () => {
    const t = new TransportGraph();

    const misereorId = 1;
    const bushofId = 2;
    const talbotId = 3;

    t.addStop(new Stop(misereorId, "Misereor"));
    t.addStop(new Stop(bushofId, "Bushof"));
    t.addStop(new Stop(talbotId, "Talbot"));

    expect(t.getNumberOfVertices()).toBe(MINUTES*3);
    expect(t.getNeighbors(`${misereorId}:${MINUTES-1}`)[0]).toEqual(`${misereorId}:0`);
});