import {PriorityQueue} from "./priorityqueue";

test("PriorityQueue", () => {
    const p = new PriorityQueue<string>();

    p.insert(1, "C");
    p.insert(2, "D");
    p.insert(0, "A");
    p.insert(0, "B");
    p.insert(3, "E");

    const list = [];
    while(!p.empty()) {
        list.push(p.pop()?.elem);
    }

    expect(list).toEqual(["A","B","C","D","E"]);
});