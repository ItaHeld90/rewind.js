export type Prop = string | number;

export enum ActionType {
    Update,
    Delete,
    Push,
}

export type UpdateAction = {
    obj: Object;
    prop: Prop;
    oldVal: any;
    newVal: any;
};

export type PushAction = {
    arr: any[];
    val: any;
};

export type DeleteAction = {
    obj: Object;
    prop: Prop;
    oldVal: any;
};

export type ActionData = UpdateAction | PushAction | DeleteAction;

export type Action = { type: ActionType; info: ActionData };

// Stack
export type ActionStack = Action[];
export type UndoRedoStack = ActionStack[];

// ***************************************************

// Observable

export interface Options {
    onChange: (obj: Object, prop: Prop, oldVal: any, newVal: any) => void;
    onPush: (arr: any[], val: any) => void;
    onDelete: (obj: Object, prop: Prop) => void;
}