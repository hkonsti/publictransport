import {TransportGraph} from "../graph/transportgraph";
import {Dijkstra} from "../graph/dijkstra";

import type {Id} from "../graph/timegraph";
import {DataStore} from "./datastore";

async function main(): Promise<void> {

	const data = new DataStore("./data");
	await data.intialize();

	const start: Id = `${100870}:${1000}`; // Aachen Main Station Mon, 4:40 PM
	const goal = 440590; // Cologne Main Station

	let time = Date.now();
	const path = Dijkstra.findShortestPath(data.t, start, goal);
	console.log(`Found connection in ${Date.now()-time}ms`);
	const converted = data.t.convertPath(path);

	const readable = [];

	for (const e of converted) {
		const from = data.stops.get(parseInt(e.from.split(":")[0]!))!;
		const to = data.stops.get(parseInt(e.to.split(":")[0]!))!;
		readable.push({from, to, transport: e.transport.name, length: TransportGraph.getTimeDifference(e.from, e.to)});
	}

	console.log(readable);
}

main()