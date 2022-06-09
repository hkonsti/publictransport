import {TimeGraph, Id} from "./timegraph";
import type {PointTo} from "./graph";

export interface Transportation {
    name: string;
}

export interface Edge extends PointTo<Id> {
    transportation: Transportation;
}

export class TransportGraph extends TimeGraph<Edge> {

    private static waiting: Transportation = {name: "waiting"};
    private static createWaitingEdge(id: Id): Edge {
        return {
            to: id,
            transportation: TransportGraph.waiting,
        };
    }

    constructor() {
        const minutes = 60 * 24 * 7;
        super(minutes, TransportGraph.createWaitingEdge)
    }

    public convertPath(path: Id[]) {
        const res: {
            from: Id,
            to: Id,
            transport: Transportation,
        }[] = [];

        if (path.length < 2) {
            return res;
        }

        let pred = path[0]!;

        for (let i = 1; i < path.length; i++) {
            const curr = path[i]!;
            const edge = this.getEdge(pred, curr);

            if (!edge) {
                throw new Error("Edge doesn't exist when converting path.");
            }

            res.push({
                from: pred,
                to: edge.to,
                transport: edge.transportation,
            });

            pred = curr;
        }

        return res;
    }
}