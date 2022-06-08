import {Graph} from "./graph";

function convertIteratorToArray(iter: IterableIterator<any>, arr: readonly any[]) {
    let i = 0;
    for (const elem of iter) {
        if (elem !== arr[i]) {
            return false;
        }
        i++;
    }
    return true;
}

test("Create a Graph and test it's functions.", () => {
    const g = new Graph<string, {to: string}>();
    expect(convertIteratorToArray(g.getVertices(), [])).toEqual(true);

    const verticies = ["0", "1", "2"] as const;
    const notExisting = "3" as const;

    for (const vertex of verticies) {
        expect(g.addVertex(vertex)).toBe(true);
    }
    expect(g.addVertex(verticies[0])).toBe(false);
    expect(convertIteratorToArray(g.getVertices(), verticies)).toEqual(true);

    expect(g.addEdge(verticies[0], {to: verticies[1]})).toBe(true);
    expect(g.addEdge(verticies[0], {to: verticies[2]})).toBe(true);

    expect(g.addEdge(verticies[0], {to: verticies[1]})).toBe(false); // exists already
    expect(g.addEdge(verticies[0], {to: notExisting})).toBe(false);
    expect(g.addEdge(notExisting, {to: verticies[0]})).toBe(false);

    expect(g.getNeighbors(verticies[0])).toEqual([verticies[1], verticies[2]]);
    expect(g.getNeighbors(verticies[1])).toEqual([]);
    expect(() => g.getNeighbors(notExisting)).toThrow("Vertex doesn't exist in Graph.");
});
