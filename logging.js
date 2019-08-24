const fs = require('fs');
const winston = require('winston');
require('winston-mongodb');

const strings = require("./strings");

const levels = {
	levels: {
		debug: 4,
		verbose: 3,
		info: 2,
		warn: 1,
		error: 0
	},
	colors: {
		debug: 'green',
		verbose: 'blue',
		info: 'white',
		warn: 'yellow',
		error: 'red'
	}
};

try {
	fs.mkdirSync('./logs');
} catch (error) {
	if (error.code !== 'EEXIST') {
		throw error;
	}
}

const defaultConsole = new winston.transports.Console({
	name: 'defaultConsole',
	level: 'debug',
	colorize: 'all',
	prettyPrint: true,
	timestamp: true
});

const mongo = new winston.transports.MongoDB({
	name: 'mongo',
	level: 'debug',
	db: 'mongodb://localhost:27017/botDev'
});

const log = new winston.Logger({
	levels: levels.levels,
	transports: [defaultConsole, mongo]
});


Object.keys(levels.levels).forEach(level => {
	const method = log[level];
	log[level] = (...args) => {
		const [argStrings, argObjs] = [[], []];
		for (const arg of args) {
			if (strings.isString(arg)) {
				argStrings.push(arg);
			} else {
				argObjs.push(arg);
			}
		}
		method(argStrings, argObjs);
	};
});

process.on('uncaughtException', error => {
	log.error({where: 'process', message: 'uncaughtException', meta: error});
});

process.on('unhandledRejection', reason => {
	log.error('process:unhandledRejection', reason);
});

function overrideConsole() {
	console.log = log.debug;
	console.debug = log.debug;
	console.verbose = log.verbose;
	console.info = log.info;
	console.warn = log.warn;
	console.error = log.error;
}

module.exports = {
	log,
	overrideConsole
};