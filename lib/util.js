const fs = require('fs');
const path = require('path');


function sleep(delay) {
	return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * @typedef {Object} mkdirOpts
 * @property {Boolean} recursive=true - Equivalent to mkdir -p
 * @type {Readonly<mkdirOpts>}
 */
const mkdirOptsDef = Object.freeze({
	recursive: true
});

/**
 * Asynchronous mkdir(2) promisified - create a directory.
 * @param {string} path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * @param {mkdirOpts} options Either the file mode, or an object optionally specifying the file mode and whether parent folders
 * should be created. If a string is passed, it is parsed as an octal integer. If not specified, defaults to `0o777`.
 * @returns {Promise<NodeJS.ErrnoException | null>}
 */
function mkdir(path, options = {}) {
	options = {...mkdirOptsDef, ...options};
	return new Promise((resolve, reject) => {
		fs.mkdir(path, options, err => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

/**
 *
 * Asynchronously writes data to a file, replacing the file if it already exists.
 * @param {PathLike | number} path A path to a file. If a URL is provided, it must use the `file:` protocol.
 * URL support is _experimental_.
 * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
 * @param data The data to write. If something other than a Buffer or Uint8Array is provided, the value is coerced to a string.
 * @param {{ encoding?: string | null, mode?: number | string, flag?: string} | string | null} options Either the encoding for the file, or an object optionally specifying the encoding, file mode, and flag.
 * If `encoding` is not supplied, the default of `'utf8'` is used.
 * If `mode` is not supplied, the default of `0o666` is used.
 * If `mode` is a string, it is parsed as an octal integer.
 * If `flag` is not supplied, the default of `'w'` is used.
 * @returns {Promise<NodeJS.ErrnoException | null>}
 */
function writeFile(path, data, options) {
	return new Promise((resolve, reject) => {
		fs.writeFile(path, data, options, error => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	})
}

async function writeObjectAsModule(filePath, object) {
	const dirname = path.dirname(filePath);
	await mkdir(dirname, {recursive: true});

	const json = JSON.stringify(object, null, '\t').replace(/"([A-Za-z_]\w*)"(?=:)/g, '$1');
	const content = `module.exports = ${json};\n`;

	return await writeFile(filePath, content);
}

/**
 * Recursively transform strings in JS Objects if possible
 * @param {Object} obj
 * @returns {Object}
 */
function objectify(obj) {
	try {
		const newObj = {};
		for (const [key, val] of Object.entries(obj)) {
			newObj[key] = jsonnify(JSON.parse(val));
		}
		return newObj;
	} catch (e) {
		return obj;
	}
}

function parseArgv() {
	const obj = {}, argv = process.argv.slice(2);
	for (let i = 0; i < argv.length; ++i) {
		if (!argv[i].startsWith('--')) {
			continue;
		}
		obj[argv[i].slice(2)] =
			argv[i + 1] != null && !argv[i + 1].startsWith('--')
				? argv[++i]
				: true;
	}

	return obj;
}

function tryOrDefault(f, def, onError) {
	try {
		return f();
	} catch (e) {
		if (onError) {
			onError(e);
		}
		return def;
	}
}

const filter = {
	uniques: (value, index, array) => array.indexOf(value) === index
};

module.exports = {
	sleep,
	parseArgv,
	writeObjectAsModule,
	filter,
	objectify,
	tryOrDefault,
	mkdir
};