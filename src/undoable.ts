import { v4 as newUuid } from 'uuid';
import { isInAction, enterUndoable, exitUndoable, currentUndoableId } from "./undo-redo-store";

//@ts-ignore
export function undoableAction<T extends any[], R>(fn: (...args: T) => R): (...args: T) => R {
    //@ts-ignore
    return (...args: T) => {
        const funcId = currentUndoableId() || newUuid();
        const isInsideAction = isInAction();

        if (!isInsideAction) {
            enterUndoable(funcId);
        }

        const res = fn(...args);

        if (!isInsideAction) {
            exitUndoable();
        }
        return res;
    }
}

export function runInUndoableAction(fn: () => any) {
    return undoableAction(fn)();
}