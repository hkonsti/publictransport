import {TimeGraph, Id} from "./timegraph";
import {PriorityQueue} from "./priorityqueue";

interface Info {
    pred: Id | undefined;
    distance: number;
}

type Path = Id[];

/**
 * Dijkstra's path finding algorithm for time based graphs.
 */
export class Dijkstra {

    static readonly MAXDEPTH = 10000;

    static findShortestPath(g: TimeGraph<any>, startId: Id, goalId: number): Path {
        const found = false;

        let currentDepth = 0;

        const dict = new Map<Id, Info>();
        const priority = new PriorityQueue<Id>();

        dict.set(startId, {pred: undefined, distance: 0});
        priority.insert(0, startId);
        
        while (!found && currentDepth <= Dijkstra.MAXDEPTH && !priority.empty()) {
            const current = priority.pop();
            const neighbors = g.getNeighbors(current!.elem);

            for (const n of neighbors) {
                if (!dict.has(n)) {
                    dict.set(n, {
                        pred: current!.elem,
                        distance: TimeGraph.getTimeDifference(startId, n)
                    });
                } else {
                    const distance = TimeGraph.getTimeDifference(startId, n)
                    if (distance < dict.get(n)!.distance) {
                        dict.set(n, {
                            pred: current!.elem,
                            distance: distance,
                        });
                    }
                }

                if (TimeGraph.isSameVertexId(n, goalId)) {
                    
                    // Reached goal
                    return Dijkstra.traceRoute(n, dict);
                }

                priority.insert(dict.get(n)!.distance, n)
            }

            currentDepth++;
        }

        if (currentDepth > Dijkstra.MAXDEPTH) {
            throw new Error("Max depth exceeded. Couldn't find a route.");
        }

        // No path found.
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
            curr = pred;
        }

        return path;
    }

}