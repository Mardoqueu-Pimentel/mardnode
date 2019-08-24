const consoleLog = console.log;

const fs = require("fs");
const util = require('util');
const assert = require('assert');
const {log} = require('./logging');

const readFile = util.promisify(fs.readFile);
const sleep = time => new Promise(f => setTimeout(f, time));

async function f1() {

	for (let i = 0; i < 1000; ++i) {
		console.log(i);
		await sleep(1);
	}

}

async function f2() {

	for (let i = 0; i < 1000; ++i) {
		console.log(i);
		await sleep(1);
	}

}

const commandEnum = Object.freeze({
	BROWSE_CATEGORIES: 'browse-categories',
	CLOSE_ORDER: 'close-order',
	MY_ORDER: 'my-order'
});

const iconEnum = Object.freeze({
	SHOPPING_CART: 'cart.png',
	CATALOG: 'catalog.png',
	BELL: 'ic_order_outline.png'
});

class Button {

	/**
	 * @param {string} text
	 * @param {string} prettyCommand
	 */
	constructor(text, prettyCommand) {
		this.command = null;
		this.customData = '{"version":-1}';
		this.prettyCommand = prettyCommand;
		this.text = text;
		this.type = 2;
		this.clickable = false;
	}

	/**
	 * @returns {Button}
	 */
	mutationBuy() {
		this.command = commandEnum.CLOSE_ORDER;
		this.icon = iconEnum.BELL;
		return this;
	}

	/**
	 * @returns {Button}
	 */
	mutationShowCatalog() {
		this.command = commandEnum.BROWSE_CATEGORIES;
		this.icon = iconEnum.CATALOG;
		return this;
	}

	/**
	 * @returns {Button}
	 */
	mutationShowShoppingCart() {
		this.command = commandEnum.MY_ORDER;
		this.icon = iconEnum.SHOPPING_CART;
		return this;
	}

	/**
	 * @returns {Button}
	 */
	makeClickable() {
		this.clickable = true;
		return this;
	}

	/**
	 * @returns {Button}
	 */
	getPayload() {
		assert(this.command !== null, 'getPayload: you need to mutate the Button');
		return this;
	}
}



setTimeout(async function () {
	console.log('This will still run.');
	a += 1
}, 500);

// Intentionally cause an exception, but don't catch it.


nonexistentFunc();


consoleLog('This will not run.');


// const bar = () => {
// 	foo();
// };

