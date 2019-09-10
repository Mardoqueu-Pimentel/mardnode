#!/usr/bin/env node

const mongoDB = require('../lib/mongoDB');
const { SplitEmitter } = require('../lib/splitEmitter');
const { objectify, tryOrDefault } = require('../lib/util');
const { prettifyLog } = require('../lib/logging');
const r = require('../r');

const envConfig = require('../lib/envConfig');

async function main() {
	await envConfig.init(r.gap('config'));
	const config = envConfig.config;

	const addr = config.MARDNODE_MONGO_ADDRESS;
	const port = config.MARDNODE_MONGO_PORT;
	const u = config.MARDNODE_MONGO_USER;
	const p = config.MARDNODE_MONGO_PASS;
	const client = await mongoDB.connect(`mongodb://${u}:${p}@${addr}:${port}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		autoReconnect: true,
		poolSize: 2
	});

	const col = client
		.db(config.MARDNODE_MONGO_DB)
		.collection(config.MARDNODE_MONGO_COLLECTION);
	const splitEmitter = new SplitEmitter(process.stdin, split => {
		const obj = tryOrDefault(() => JSON.parse(split), split);
		const logObj = obj instanceof Array
			? {...obj}
			: (
				typeof obj === 'string' || typeof obj === 'number'
					? {'0': obj}
					: obj
			);

		logObj.time = logObj.time != null
			? new Date(logObj.time).toJSON()
			: new Date().toJSON();

		col.insertOne(logObj).catch(console.error);
		delete logObj._id;

		const result = prettifyLog(logObj);
		process.stdout.write(result);
	});

	splitEmitter.on('end', () => client.close(true, () => process.exit(0)));
}

function run() {
	main().catch(console.error);
}

if (require.main === module) {
	run();
}

module.exports = {
	main
};