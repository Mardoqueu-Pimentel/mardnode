#!/bin/env node

const commandLineArgs = require('command-line-args');
const fs = require('fs');

const r = require('../r');


function caller(command, opts) {
	const module = require(`./${command}`);
	const argv = opts._unknown || [];
	const merge = module.mainArgs
		? commandLineArgs(module.mainArgs, { argv })
		: {};
	module.main(merge);
}

const mainArgs = [
	{name: 'command', defaultOption: true}
];
async function main(opts) {
	const command = opts.command;
	if (fs.readdirSync(r.gap('bin')).indexOf(`${command}.js`) !== -1) {
		caller(command, opts);
	} else {
		caller('init', opts);
	}
}

function run(argv) {
	main(commandLineArgs(mainArgs, { stopAtFirstUnknown: true }))
		.catch(console.error);
}

if (require.main === module) {
	run(process.argv);
}

module.exports = {
	main,
	mainArgs
};