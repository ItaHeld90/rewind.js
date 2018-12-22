import { spy, observable } from 'mobx';
import { ActionType, Action } from './general-types';
import { pushAction, isInAction, undo, redo } from './undo-redo-store';
import { runInUndoableAction } from './undoable';

interface MobxUpdate {
    object: Object;
    newValue: any;
    oldValue: any;
}

interface MobxObjectUpdate extends MobxUpdate {
    key: string;
}

interface MobxArrayUpdate extends MobxUpdate {
    index: number;
}

interface MobxObjectAdd {
    object: Object;
    key: string;
    newValue: any;
}

interface MobxArraySplice {
    object: any[];
    index: number;
    removed: any[];
    removedCount: number;
    added: any[];
    addedCount: number;
}

export function mobxRewind(change: any) {
    if (!isInAction()) {
        return;
    }

    switch (change.type) {
        case 'update':
            handleUpdate(change);
        case 'add':
            handleAdd(change);
        case 'splice':
            handleSplice(change);
    }
}

function handleAdd(change: any) {
    handleObjectAdd(change);
}

function handleObjectAdd(change: MobxObjectAdd) {
    handleObjectUpdate({ ...change, oldValue: undefined })
}

function handleSplice(change: MobxArraySplice) {
    if (change.addedCount && !change.removedCount && change.index >= change.object.length - 1) {
        handleArrayPush(change);
    }
}

function handleArrayPush({ added, object }: MobxArraySplice) {
    const actions: Action[] = added.map(val => ({
        type: ActionType.Push,
        info: {
            arr: object,
            val
        }
    }));

    actions.forEach(pushAction);
}

function handleUpdate(change: any) {
    Array.isArray(change.object)
        ? handleArrayUpdate(change)
        : handleObjectUpdate(change);
}

function handleArrayUpdate({ object, index, newValue, oldValue }: MobxArrayUpdate) {
    pushAction({
        type: ActionType.Update,
        info: {
            obj: object,
            prop: index.toString(),
            newVal: newValue,
            oldVal: oldValue
        }
    });
}

function handleObjectUpdate({ object, key, newValue, oldValue }: MobxObjectUpdate) {
    console.log('old val:', oldValue, 'new val:', newValue, 'object:', object, 'prop:', key);
    pushAction({
        type: ActionType.Update,
        info: {
            obj: object,
            prop: key,
            newVal: newValue,
            oldVal: oldValue
        }
    });
}

// Test

spy(change => {
    mobxRewind(change);
});

const obs = observable([1, 2, 3]);

console.log(obs.toJS());

runInUndoableAction(() => {
    obs.push(4);
});

console.log(obs.toJS());

undo();

console.log(obs.toJS());