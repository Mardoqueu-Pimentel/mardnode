'use strict';

const fs = require('fs');
const winston = require('winston');

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
	prettyPrint: true
});

const logsFile = new winston.transports.File({
	name: 'logs',
	level: 'debug',
	dirname: 'logs',
	filename: 'logs.log',
	json: true,
	prettyPrint: true,
	eol: '\n\n'
});

const errorsFile = new winston.transports.File({
	name: 'errors',
	level: 'error',
	dirname: 'logs',
	filename: 'errors.log',
	json: true,
	prettyPrint: true,
	eol: '\n\n'
});

const log = new winston.Logger({
	levels: levels.levels,
	transports: [defaultConsole, logsFile, errorsFile],
	exceptionHandlers: [defaultConsole, errorsFile]
});

process.on('unhandledRejection', reason => { throw reason; });

module.exports = log;