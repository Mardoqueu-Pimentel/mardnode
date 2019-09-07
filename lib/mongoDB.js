const mongodb = require('mongodb');

/**
 * @param {string} uri
 * @param {MongoClientOptions} options
 * @returns {Promise<MongoClient>}
 */
function connect(uri, options) {
	return new Promise((resolve, reject) =>
		mongodb.MongoClient.connect(uri, options,
			(error, result) => (error ? reject : resolve)(error ? error : result)
		)
	);
}

module.exports = {
	connect
};