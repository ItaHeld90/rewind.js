import { v4 as newUuid } from 'uuid';
import { currentUndoableId, setUndoableId, isInAction, enterUndoable, exitUndoable } from './undo-redo-store';

// @ts-ignore
export function undoableAsync<T extends any[]>(fn: (...args: T) => IterableIterator<any>): (...args: T) => Promise<any> {
	// @ts-ignore
	return async (...args: T) => {
		const funcId = currentUndoableId() || newUuid();
		const isInsideAction = isInAction();

		if (!isInsideAction) {
			enterUndoable(funcId);
		}

		const gen = fn(...args);

		let res = gen.next();

		while (res.value instanceof Promise) {
			setUndoableId(undefined);
			const newRes = await res;
			setUndoableId(funcId);
			res = gen.next(newRes);
		}

		if (!isInsideAction) {
			exitUndoable();
		}

		return res.value;
	}
}

export function runInUndoableAsync(fn: () => any) {
	undoableAsync(fn)();
}