const events = require('events');


class SplitEmitter extends events.EventEmitter {
	constructor(stream, listener, sep = '\n') {
		super();
		this.sep = sep;
		this.buffer = '';
		this.addListener('split', listener);
		stream.on('data', this._onData.bind(this));
		stream.on('end', this._onEnd.bind(this));
	}

	_emitSplit(split) {
		process.nextTick(() => this.emit('split', split));
	}

	_emitEnd() {
		process.nextTick(() => this.emit('end'));
	}

	_onData(data) {
		this.buffer += data.toString();
		const splits = this.buffer.split(this.sep);
		splits.slice(0, -1).filter(x => x).forEach(this._emitSplit.bind(this));
		this.buffer = splits[splits.length - 1];
	}

	_onEnd() {
		if (this.buffer.length > 0) {
			this._emitSplit(this.buffer);
		}
		this._emitEnd();
	}
}

module.exports = {
	SplitEmitter
};