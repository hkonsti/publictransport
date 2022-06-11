import {TransportGraph} from "../graph/transportgraph";
import {Dijkstra} from "../graph/dijkstra";

import type {Id} from "../graph/timegraph";
import {DataStore} from "./datastore";

/**
 * Example for what this project can do.
 */
async function main(): Promise<void> {

	// Read all the transit data from ./data
	const data = new DataStore("./data");
	await data.intialize();

	// Pick a start, a start time and where you want to go.
	const start: Id = `${100870}:${1000}`; // Aachen Main Station Mon, 4:40 PM
	const goal = 440590; // Cologne Main Station

	// Find the shortest path within the graph.
	let time = Date.now();
	const path = Dijkstra.findShortestPath(data.t, start, goal);
	console.log(`Found connection in ${Date.now()-time}ms`);

	// Do something with the result.
	const converted = data.t.convertPath(path);
	const somewhatReadable = [];

	for (const e of converted) {
		const from = data.stops.get(parseInt(e.from.split(":")[0]!))!;
		const to = data.stops.get(parseInt(e.to.split(":")[0]!))!;
		somewhatReadable.push({from, to, transport: e.transport.name, length: TransportGraph.getTimeDifference(e.from, e.to)});
	}

	console.log(somewhatReadable);
}

main()