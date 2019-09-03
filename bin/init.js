#!/bin/env node

const inquirer = require('inquirer');
const util = require('../lib/util');
const r = require('../r');


async function main() {
	const config = await inquirer.prompt([
		{
			type: 'list',
			name: 'MARDNODE_LOG_EXTREME',
			default: 'false',
			choices: ['true', 'false'],
			filter: eval
		},
		{
			type: 'list',
			name: 'MARDNODE_LOG_FLUSH_TIME',
			default: '10000',
			choices: ['5000', '10000', '15000', '20000', '30000'],
			filter: parseInt
		},
		{
			type: 'list',
			name: 'MARDNODE_GO_HORSE',
			default: 'GO!',
			choices: [
				'GO!',
				'NO!'
			],
			filter: x => x === 'GO!'
		}
	]);

	await util.writeObjectAsModule(r.gap('config/config.js'), config);
}

function run() {
	main()
		.catch(reason => {
			console.error(reason);
			process.exit(1);
		})
		.then(() => {
			console.info('Done.');
		});
}

if (require.main === module) run();