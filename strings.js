function isString(obj) {
	return typeof obj === 'string' || obj instanceof String;
}

/**
 * Compare two strings
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function compare(a, b) {
	if (a > b) {
		return 1;
	}
	if (a < b) {
		return -1;
	}
	return 0;
}

/**
 * Make a string comparator
 * @param key
 * @param caseInsensitive
 * @returns {function(*=, *=): number}
 */
function makeComparator(key = x => x, caseInsensitive=false) {
	if (caseInsensitive) {
		return (a, b) => {
			a = key(a).toLowerCase();
			b = key(b).toLowerCase();
			return compare(a, b);
		}
	}
	return (a, b) => {
		a = key(a);
		b = key(b);
		return compare(a, b);
	}
}

module.exports = {
	isString,
	compare,
	makeComparator
};