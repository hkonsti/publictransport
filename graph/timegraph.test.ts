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

	expect(t.getNumberOfVertices()).toBe(3);
	expect(t.getNeighbors(`${misereorId}:${0}`)[0]?.to).toEqual(`${misereorId}:${0}`);
	expect(t.getNeighbors(`${misereorId}:${1}`)[0]?.to).toEqual(`${misereorId}:${0}`);
	expect(t.getNumberOfVertices()).toBe(4);
});

test("Lazy vertex creation edge cases", () => {
	const t = new TimeGraph<PointTo<Id>>(MINUTES, createWaitingEdge);
	const misereorId = 1;
	const bushofId = 2;

	t.addTimeVertex(misereorId);

	expect(() => t.addEdge(`${misereorId}:0`, {to: `${misereorId}:${MINUTES + 1}`}))
		.toThrow("Timestamp is out of range.");

	expect(() => t.addEdge(`${misereorId}:0`, {to: `${bushofId}:${MINUTES - 1}`}))
		.toThrow("Zero-Vertex doesn't exist.");
});

test("Benchmark", () => {
	const t = new TimeGraph<PointTo<Id>>(MINUTES, createWaitingEdge);

	for (let i = 0; i < 10000; i++) {
		t.addTimeVertex(i);
	}

	for (let i = 0; i < 100000; i++) {
		const randomLeft = Math.floor(Math.random() * 10000);
		const randomRight = Math.floor(Math.random() * 10000);

		const randomTimeLeft = Math.floor(Math.random() * 60 * 24 * 7);
		const randomTimeRight = Math.floor(Math.random() * 60 * 24 * 7);

		t.addEdge(`${randomLeft}:${randomTimeLeft}`, {to: `${randomRight}:${randomTimeRight}`});
	}
});