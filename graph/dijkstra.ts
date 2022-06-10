import {PriorityQueue} from "./priorityqueue";
import {Edge, TransportationType, TransportGraph} from "./transportgraph";

import type {Id} from "./timegraph";

interface Info {
    pred: Edge | undefined;
    distance: number;
}

type Path = Id[];

/**
 * Dijkstra's path finding algorithm for transport graphs.
 */
export class Dijkstra {

    static readonly MAXDEPTH = 15000;

    static findShortestPath(g: TransportGraph, startId: Id, goalId: number, maxdepth = Dijkstra.MAXDEPTH): Path {
        let currentDepth = 0;

        const dict = new Map<Id, Info>();
        const priority = new PriorityQueue<Edge>();

        dict.set(startId, {pred: undefined, distance: 0});
        priority.insert(0, {to: startId, transportation: {name: "waiting", type: TransportationType.WAITING}});

        while (currentDepth <= maxdepth && !priority.empty()) {
            const current = priority.pop();
            const neighbors = g.getNeighbors(current!.elem.to);

            for (const n of neighbors) {
                if (!dict.has(n.to)) {
                    dict.set(n.to, {
                        pred: current!.elem,
                        distance: TransportGraph.getTimeDifference(startId, n.to)
                    });
                    priority.insert(dict.get(n.to)!.distance, n)
                }

                if (TransportGraph.isSameVertexId(n.to, goalId)) {

                    // Reached goal
                    return Dijkstra.traceRoute(n.to, dict);
                }
            }
            currentDepth++;
        }

        if (currentDepth > maxdepth) {
            throw new Error("Max depth exceeded. Couldn't find a route.");
        }

        return [];
    }

    public static traceRoute(res: Id, dict: Map<Id, Info>) {
        const path: Path = [];
        let curr = res

        while (true) {
            path.unshift(curr);
            const pred = dict.get(curr)!.pred;
            if (!pred) {
                break;
            }
            curr = pred.to;
        }

        return path;
    }

}