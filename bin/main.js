#!/usr/bin/env node

const r = require('../r');
const envConfig = require('../lib/envConfig');
const {log} = require('../lib/logging');

async function main() {
	await envConfig.init(r.gap('config'));

	setInterval(() => {

		for (const level of Object.keys(log.levels.values)) {
			log[level](`testing log.${level}`);
		}

	}, 1000);
}

function run() {
	main().catch(console.error);
}

run();