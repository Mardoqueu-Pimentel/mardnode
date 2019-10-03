#!/usr/bin/env node

const { SplitEmitter } = require('../lib/splitEmitter');
const { tryOrDefault } = require('../lib/util');
const { prettifyLog } = require('../lib/logging');

async function main() {
	const splitEmitter = new SplitEmitter(process.stdin, split => {
		const obj = tryOrDefault(() => JSON.parse(split), split);
		const logObj = obj instanceof Array
			? {...obj}
			: (
				typeof obj === 'string' || typeof obj === 'number'
					? {'0': obj}
					: obj
			);

		logObj.time = logObj.time != null
			? new Date(logObj.time).toJSON()
			: new Date().toJSON();

		delete logObj._id;

		const result = prettifyLog(logObj);
		process.stdout.write(result);
	});
}

function run() {
	main().catch(console.error);
}

if (require.main === module) {
	run();
}

module.exports = {
	main
};