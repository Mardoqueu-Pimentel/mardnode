const pino = require('pino');

const MARDNODE_LOG_EXTREME = process.env.MARDNODE_LOG_EXTREME === 'true';
const MARDNODE_LOG_FLUSH_TIME = parseInt(process.env.MARDNODE_LOG_FLUSH_TIME) || 10000;
const MARDNODE_GO_HORSE = process.env.MARDNODE_GO_HORSE === 'go';

const log = pino({
	level: 'trace',
	base: null,
}, MARDNODE_LOG_EXTREME ? pino.extreme() : undefined);
log[pino.symbols.endSym] = '}\n';

if (MARDNODE_LOG_EXTREME) {
	setInterval(() => log.flush(), MARDNODE_LOG_FLUSH_TIME).unref();
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
	MARDNODE_GO_HORSE
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