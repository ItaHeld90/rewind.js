import { v4 as newUuid } from 'uuid';
import { currentUndoableId, setUndoableId, isInAction, enterUndoable, exitUndoable } from './undo-redo-store';

export function undoableAsync<T extends Function>(fn: T): T {
	return new Proxy(fn, {
		apply: async (target, thisArg, args) => {
			const funcId = currentUndoableId() || newUuid();
			const isInsideAction = isInAction();

			if (!isInsideAction) {
				enterUndoable(funcId);
			}

			const gen = Reflect.apply(target, thisArg, args);

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
		},
	});
}
