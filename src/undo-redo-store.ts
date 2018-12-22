import { Action, ActionStack, UndoRedoStack } from './general-types';
import { redoAction, undoAction } from './undo-redo-action';

const actionStacks: Map<string, ActionStack> = new Map();

const undoStack: UndoRedoStack = [];
const redoStack: UndoRedoStack = [];

let undoableId: string;

export function redo() {
	const actions = popLastRedoActions();

	if (actions) {
		actions.forEach(redoAction);

		// push to the undo stack
		undoStack.push(actions);
	}
}

export function undo() {
    const actions = popLastUndoActions();

	if (actions) {
		actions.forEach(undoAction);

		// push to the redo stack
		redoStack.push(actions);
	}
}

function getActiveActionStack() {
	return actionStacks.get(undoableId);
}

export function currentUndoableId(): string {
	return undoableId;
}

export function setUndoableId(newUndoableId: string) {
	undoableId = newUndoableId;
}

export function isInAction(): boolean {
	return undoableId != null;
}

function popLastActions(undoRedoStack: UndoRedoStack): ActionStack {
	const lastActionsStack = undoRedoStack.pop();
	return lastActionsStack ? lastActionsStack.reverse() : null;
}

export function popLastUndoActions(): ActionStack {
	return popLastActions(undoStack);
}

export function popLastRedoActions(): ActionStack {
	return popLastActions(redoStack);
}

export function enterUndoable(funcId: string) {
    if (!isInAction()) {
		undoableId = funcId;
		actionStacks.set(funcId, []);
	}
}

export function exitUndoable() {
	const activeActionStack = getActiveActionStack();

	if (activeActionStack && activeActionStack.length) {
		undoStack.push(activeActionStack);
	}

    undoableId = undefined;
	actionStacks.delete(undoableId);
}

export function pushAction(action: Action) {
    const activeActionStack = getActiveActionStack();
	activeActionStack.push(action);
}
