const inquirer = require('inquirer');
const nodeUtil = require('util');
const util = require('../lib/util');
const fs = require('fs');
const path = require('path');

let _envConfig = null;

function makeEnvConfig(config, template) {
	const keyedTemplate = {};
	for (const [key, val] of Object.entries(template)) {
		keyedTemplate[key] = val;
	}

	function get(target, key) {
		const template = keyedTemplate[key];

		const value = process.env[key];
		if (value === undefined) {
			return target[key];
		}

		const inChoices = template.choices
			? template.choices.indexOf(value) !== -1
			: true;
		const filteredValue = template.filter
			? template.filter(value)
			: value;

		return inChoices && filteredValue !== undefined
			? filteredValue
			: target[key];
	}

	const cache = {};
	function cachedGet(target, key) {
		if (key in cache) {
			return cache[key];
		}
		return cache[key] = get(target, key);
	}

	return new Proxy({...config}, {get: cachedGet});
}

async function makeConfig(template, path) {
	const config = await inquirer.prompt(template);
	await util.writeObjectAsModule(path, config);
	return config;
}

const fsExists = path => new Promise(resolve => fs.exists(path, exists => resolve(exists)));

async function init(configDirPath) {
	const templatePath = path.join(configDirPath, 'template.js');
	const configPath = path.join(configDirPath, 'config.js');

	const template = require(templatePath);
	if (template == null) {
		throw new Error(`Error while loading template.js in '${templatePath}'`);
	}

	const config = await fsExists(configPath)
		? require(configPath)
		: makeConfig(template, configPath);

	return _envConfig = makeEnvConfig(config, template);
}

module.exports = {
	init,
	get config () {
		if (_envConfig == null) {
			throw new Error('You need to call init first');
		}
		return _envConfig;
	}
};
