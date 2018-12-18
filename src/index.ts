import { observable } from "./observable";
import { undoableAction } from "./undoable";
import { undo, redo } from "./undo-redo-store";
import { undoableAsync } from "./async-undoable";

const bla = observable({ x: 1, y: 2 });
const foo = observable([1, 2, 3]);
const bar = observable({ a: 'hello', b: 'world' });

const main = undoableAction((obj: Object) => {
    obj['x'] = 3;
    subFunc();
    obj['y'] = 4;
});

const subFunc = undoableAction(() => {
    foo[0] = 4;
    foo[1] = 5;
});

const another = undoableAction(() => {
    bar.a = 'hi';
    bar.b = 'bye';
});

// console.log('before');
// console.log(bla);
// console.log(foo);
// console.log(bar);
// main(bla);
// another();
// console.log('after');
// console.log(bla);
// console.log(foo);
// console.log(bar);
// undo();
// console.log('first undo');
// console.log(bla);
// console.log(foo);
// console.log(bar);
// redo();
// console.log('redo');
// console.log(bla);
// console.log(foo);
// console.log(bar);
// undo();
// console.log('reundo');
// console.log(bla);
// console.log(foo);
// console.log(bar);
// undo();
// console.log('second undo');
// console.log(bla);
// console.log(foo);
// console.log(bar);

// async

function wait(amount: number) {
	return new Promise(resolve => {
		setTimeout(resolve, amount);
	});
}

const changeBlaAsync = function*(num1: number, num2: number) {
	yield wait(1000);
    bla.x = 3;
    bla.y = 4;
};

const changeFooAsync = function*(num1: number, num2: number) {
    foo[0] = 4;
    yield delayer();
    undoableAction(() => {
        foo[2] = 6;
    })()
	return num1 - num2;
};

const delayer = undoableAsync(function*() {
    yield wait(100);
    foo[1] = 5;
	yield wait(200);
});

const addP = undoableAsync(changeBlaAsync);
const subP = undoableAsync(changeFooAsync);

async function mathAsync() {
    console.log('before:');
    console.log(bla);
    console.log(foo);
    
	const addPromise = addP(1, 2);
	const subPromise = subP(4, 2);
	await subPromise;
	await addPromise;
    
    console.log('after:');
	console.log(bla);
    console.log(foo);
    undo();
    console.log('first undo:');
    console.log(bla);
    console.log(foo);
    undo();
    console.log('second undo:');
    console.log(bla);
    console.log(foo);
}

mathAsync();