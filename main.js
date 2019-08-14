const log = require('./log');

async function main() {

	log.debug('debug message');
	log.verbose('verbose message');
	log.info('info message');
	log.warn('warn message');
	log.error('error message');

	a += 1;
}

main();