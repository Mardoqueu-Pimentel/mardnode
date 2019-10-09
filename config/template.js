module.exports = [
	{
		type: 'input',
		name: 'MARDNODE_MONGO_ADDRESS',
		message: 'Address where mongo is running',
		default: 'localhost',
		filter: x => x.match(/^\S+$/) ? x : undefined
	},
	{
		type: 'input',
		name: 'MARDNODE_MONGO_PORT',
		message: 'The port where mongo is running',
		default: '27017',
		filter: x => x.match(/^\d+$/) ? parseInt(x) : undefined
	},
	{
		type: 'input',
		name: 'MARDNODE_MONGO_DB',
		message: 'The database that will be used by the application',
		default: 'DB',
		filter: x => x.match(/^\S+$/) ? x : undefined
	},
	{
		type: 'input',
		name: 'MARDNODE_MONGO_COLLECTION',
		message: 'The collection where the logs will be saved',
		default: 'log',
		filter: x => x.match(/^\S+$/) ? x : undefined
	},
	{
		type: 'list',
		name: 'MARDNODE_LOG_EXTREME',
		default: 'false',
		choices: ['true', 'false'],
		filter: x => Object({true: true, false: false})[x]
	},
	{
		type: 'list',
		name: 'MARDNODE_LOG_FLUSH_TIME',
		default: '10000',
		choices: ['5000', '10000', '15000', '20000', '30000'],
		filter: x => x.match(/^\d+$/) ? parseInt(x) : undefined,
		when: x => x.MARDNODE_LOG_EXTREME
	},
	{
		type: 'list',
		name: 'MARDNODE_GO_HORSE',
		default: 'GO!',
		choices: [
			'GO!',
			'NO!'
		]
	},
	{
		type: 'input',
		name: 'MARDNODE_MONGO_USER',
		message: 'Mongodb user',
		validate: x => x.length > 0
	},
	{
		type: 'password',
		name: 'MARDNODE_MONGO_PASS',
		message: 'Mongodb password',
		validate: x => x.length > 0
	}
];
