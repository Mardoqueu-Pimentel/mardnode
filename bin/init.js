#!/usr/bin/env node

const r = require('../r');
const envConfig = require('../lib/envConfig');

async function main(opts) {
	await envConfig.init(r.gap('config'));
}

function run() {
	main().catch(console.error);
}

if (require.main === module) run();

module.exports = {
	main,
};