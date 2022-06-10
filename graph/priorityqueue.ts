interface PriorityQueueElem<T> {
	priority: number;
	elem: T;
}

/**
 * Priority Queue where lower number equals to higher priority.
 * 
 * We could use a Heap here for potential speed up.
 */
export class PriorityQueue<T> {

	private list: PriorityQueueElem<T>[] = [];

	insert(priority: number, elem: T) {
		// Slow linear search for insert.
		let inserted = false
		let i = 0;
		while (i <= this.list.length && !inserted) {
			if (this.list[i] === undefined || this.list[i]!.priority > priority) {
				this.list.splice(i, 0, {priority, elem});
				inserted = true;
			}
			i++;
		}
	}

	pop(): PriorityQueueElem<T> | undefined {
		return this.list.shift();
	}

	empty(): boolean {
		return this.list.length == 0;
	}
}