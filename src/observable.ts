import { isInAction, pushAction } from './undo-redo-store';
import { Options, Prop, ActionType } from './general-types';

export function observable<T extends Object>(obj: T): T {
	const options: Options = {
		onChange: (obj: Object, prop: Prop, oldVal: any, newVal: any) => {
			if (isInAction()) {
				pushAction({
					type: ActionType.Update,
					info: {
						obj,
						prop,
						oldVal,
						newVal,
					},
				});
			}
		},
		onPush: (arr: any[], val: any) => {
			if (isInAction()) {
				pushAction({
					type: ActionType.Push,
					info: {
						arr,
						val,
					},
				});
			}
		},
		onDelete: (obj: Object, prop: Prop) => {
			if (isInAction()) {
				pushAction({
					type: ActionType.Delete,
					info: {
						obj,
						prop,
						oldVal: obj[prop],
					},
				});
			}
		},
	};

	return createObjProxy(obj, options);
}

function createObjProxy<T extends Object>(obj: T, options: Options): T {
	return new Proxy(obj, {
		set: (target, prop, newVal) => {
			if (typeof prop !== 'symbol') {
				if (Array.isArray(target) && !(prop in target)) {
					options.onPush(target, newVal);
				} else {
					options.onChange(target, prop, target[prop], newVal);
				}
			}

			return Reflect.set(target, prop, newVal);
		},
		deleteProperty: (target, prop) => {
			if (typeof prop !== 'symbol') {
				options.onDelete(target, prop);
			}

			return Reflect.deleteProperty(target, prop);
		},
	});
}
