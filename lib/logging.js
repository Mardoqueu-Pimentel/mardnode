const chalk = require('chalk');
const pino = require('pino');
const util = require('util');

const config = require('../config/config');

const log = pino({
	level: 'trace',
	base: null,
}, config.MARDNODE_LOG_EXTREME ? pino.extreme() : undefined);
log[pino.symbols.endSym] = '}\n';

if (config.MARDNODE_LOG_EXTREME) {
	setInterval(() => log.flush(), config.MARDNODE_LOG_FLUSH_TIME).unref();
}

for (const level of Object.keys(log.levels.values)) {
	const method = log[level].bind(log);
	log[level] = function logProxy() {
		const caller = arguments.callee.caller;
		method({
			where: caller ? (caller.name ? caller.name : undefined) : undefined,
			...Object.values(arguments).map(value => {
				if (value instanceof Error) {
					value = Object.getOwnPropertyNames(value).reduce((obj, key) => {
						obj[key] = value[key];
						return obj;
					}, {});
				}
				return value;
			})
		});
	}
}

log.verbose = log.info;

function overrideConsole() {
	for (const level of ['trace', 'debug', 'info', 'warn', 'error']) {
		console[level] = log[level].bind(log);
	}
	console.log = log.debug.bind(log);
	console.verbose = log.info.bind(log);
}

function handleErrorsAndMore() {
	for (evt of ['beforeExit', 'exit', 'SIGINT', 'SIGQUIT', 'SIGTERM']) {
		process.on(evt, () => {
			log.info(`caught:${evt}`);
			log.flush();
			process.exit(0);
		});
	}

	process.on('unhandledRejection', reason => {
		log.error('caught:unhandledRejection', reason && reason.stack
			? reason.stack.split('\n')
			: reason
		);
	});

	process.on('uncaughtException',
		config.MARDNODE_GO_HORSE === 'GO!'
			? error => {
				log.error('caught:uncaughtException', 'GO HORSE!', error && error.stack
					? error.stack.split('\n')
					: error
				);
			}
			: error => {
				log.fatal('caught:uncaughtException', error && error.stack
					? error.stack.split('\n')
					: error
				);
				log.flush();
				process.exit(1);
			}
	);
}

const logLevelColor = {
	def: chalk.magentaBright,
	trace: chalk.cyanBright,
	debug: chalk.blueBright,
	info: chalk.blue,
	warn: chalk.yellowBright,
	error: chalk.redBright,
	fatal: chalk.red
};

/**
 * @param {{level?: Number, time: string}} jsonLog
 */
function prettifyLog(jsonLog) {
	const time = jsonLog.time.replace(/[T|Z]/g, ' ');
	delete jsonLog.time;

	const logLevelStr = log.levels.labels[jsonLog.level] || 'USER';
	delete jsonLog.level;
	const header = (logLevelColor[logLevelStr] || logLevelColor.def)
		(time + logLevelStr.toUpperCase());
	const stringRep = util.inspect(
		jsonLog,
		{
			showHidden: false,
			depth: null,
			colors: true,
			compact: false,
			breakLength: Infinity,
			sorted: true
		}
	);

	return `${header}\n${stringRep}\n \n`;
}

module.exports = {
	log,
	overrideConsole,
	handleErrorsAndMore,
	prettifyLog
};