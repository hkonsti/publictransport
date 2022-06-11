interface PriorityQueueElem<T> {
	priority: number;
	elem: T;
}

/**
 * Priority Queue where lower number equals to higher priority.
 * 
 * For potential speedup, a heap could be used here.
 */
export class PriorityQueue<T> {

	private list: PriorityQueueElem<T>[] = [];

	insert(priority: number, elem: T) {
		// Binary search could be used here for faster inserts.
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