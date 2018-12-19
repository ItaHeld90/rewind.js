import { spy, observable } from 'mobx';
import { ActionType } from './general-types';
import { pushAction, isInAction, undo, redo } from './undo-redo-store';
import { undoableAction } from './undoable';

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

spy(change => {
    if (!isInAction()) {
        return;
    }

    console.log(change);

    switch (change.type) {
        case 'update':
            handleUpdate(change);
    }
});

function handleUpdate(change: any) {
    return Array.isArray(change.object)
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

const obs = observable({ x: 1, y: 2 });

console.log(obs.x);

undoableAction(() => {
    obs.x = 3;
})();

console.log(obs.x);

undo();
console.log(obs.x);

redo();
console.log(obs.x);

undo();
console.log(obs.x)