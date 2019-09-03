const path = require('path');

/**
 * Get absolute path from relative path (from project root)
 * @param {string} rp
 * @returns {string}
 */
function gap(rp) {
	return path.join(__dirname, rp);
}

module.exports = {
	gap
};