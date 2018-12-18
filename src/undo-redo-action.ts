import { Action, ActionType, UpdateAction, PushAction, DeleteAction } from "./general-types";

export function undoAction(action: Action) {
    const reversedActionFn = getUndoActionFn(action);
    // @ts-ignore
    reversedActionFn(action.info);
}

export function redoAction(action: Action) {
    const redoActionFn = getRedoActionFn(action);
    // @ts-ignore
    redoActionFn(action.info);
}

function getRedoActionFn(action: Action) {
    switch (action.type) {
        case ActionType.Update:
            return redoUpdate;
        case ActionType.Push:
            return redoPush;
        case ActionType.Delete:
            return redoDelete;
        default:
            return () => { };
    }
}

function getUndoActionFn(action: Action) {
    switch (action.type) {
        case ActionType.Update:
            return reverseUpdate;
        case ActionType.Push:
            return reversePush;
        case ActionType.Delete:
            return reverseDelete;
        default:
            return () => { };
    }
}

function redoUpdate({ obj, prop, newVal }: UpdateAction) {
    obj[prop] = newVal;
}

function redoPush({ arr, val }: PushAction) {
    arr.push(val);
}

function redoDelete({ obj, prop }: DeleteAction) {
    delete obj[prop];
}

function reverseUpdate({ obj, prop, oldVal }: UpdateAction) {
    obj[prop] = oldVal;
}

function reversePush({ arr }: PushAction) {
    arr.pop();
}

function reverseDelete({ obj, prop, oldVal }: DeleteAction) {
    obj[prop] = oldVal;
}