import { v4 as newUuid } from 'uuid';
import { isInAction, enterUndoable, exitUndoable, currentUndoableId } from "./undo-redo-store";

export function undoableAction<T extends Function>(fn: T) {
    return new Proxy(fn, {
        apply: (target, thisArg, args) => {
            const funcId = currentUndoableId() || newUuid();
            const isInsideAction = isInAction();

            if (!isInsideAction) {
                enterUndoable(funcId);
            }

            const res = Reflect.apply(target, thisArg, args);

            if (!isInsideAction) {
                exitUndoable();
            }
            return res;
        },
    });
}