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
    private static createWaitingEdge (id: Id): Edge {
        return {
            to: id,
            transportation: this.waiting,
        };
    }

    constructor() {
        const minutes = 60 * 24 * 7;
        super(minutes, TransportGraph.createWaitingEdge)
    }

}