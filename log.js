'use strict';

const fs = require('fs');
const winston = require('winston');
require('winston-daily-rotate-file');

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

const logsFile = new (winston.transports.DailyRotateFile)({
	name: 'logs',
	level: 'error',
	dirname: './logs',
	filename: '%DATE%-logs.log',
	datePattern: 'YYYY-MM-DD-HH',
	json: true,
	prettyPrint: true,
	zippedArchive: true,
	maxSize: '20m',
	maxFiles: '31d'
});

const errorsFile = new (winston.transports.DailyRotateFile)({
	name: 'errors',
	level: 'error',
	dirname: './logs',
	filename: '%DATE%-errors.log',
	datePattern: 'YYYY-MM-DD-HH',
	json: true,
	prettyPrint: true,
	zippedArchive: true,
	maxSize: '10m',
	maxFiles: '31d'
});

const log = new winston.Logger({
	levels: levels.levels,
	transports: [defaultConsole, logsFile, errorsFile],
	exceptionHandlers: [defaultConsole, errorsFile]
});

process.on('unhandledRejection', reason => { throw reason; });

module.exports = log;
