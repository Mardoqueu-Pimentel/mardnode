const {log, overrideConsole} = require('./logging');

const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout));

overrideConsole();

async function main() {

	console.log('console.log');

	console.log({
		a: 123,
		b: {
			a: 123
		},
		c: undefined
	});

	await sleep(250);

	log.debug('log.debug');
	console.debug('console.debug');

	await sleep(250);

	log.info('log.info');
	console.info('console.info');

	await sleep(250);


	b += 1;

	log.warn('log.warn');
	console.warn('console.warn');

	await sleep(250);

	log.error('log.error');
	console.error('console.error');

	await sleep(250);

	console.error({
		a: 1,
		b: 2,
		c: {
			a: 1,
			b: 2,
			c: {
				a: 1,
				b: 2,
				c: {

				}
			}
		}
	}, '123');
}

(async function run() {
	await main();
})();

setInterval(() => log.info('running'), 1000);

setInterval(() => {
	log.info('running for error', 5000);
	c += 1;
}).unref();

a += 1;