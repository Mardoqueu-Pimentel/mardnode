const pino = require('pino');

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
			...arguments
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

for (evt of ['beforeExit', 'exit', 'SIGINT', 'SIGQUIT', 'SIGTERM']) {
	process.on(evt, () => {
		log.info(`caught:${evt}`);
		log.flush();
		process.exit(0);
	});
}

process.on('unhandledRejection', reason => {
	log.error('caught:unhandledRejection', reason.stack.split('\n'));
});

process.on('uncaughtException',
	config.MARDNODE_GO_HORSE
		? error => {
			log.error('caught:uncaughtException', 'GO HORSE!', error.stack.split('\n'));
		}
		: error => {
			log.fatal('caught:uncaughtException', error.stack.split('\n'));
			log.flush();
			process.exit(1);
		}
);

module.exports = {
	log,
	overrideConsole
};