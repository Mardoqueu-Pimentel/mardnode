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

module.exports = {
	parseArgv
};