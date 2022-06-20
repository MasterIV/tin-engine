let game;

export default {
	keys: {
		32: 'space',
		27: 'esc',
		13: 'enter',
		38: 'up',
		87: 'up',
		40: 'down',
		83: 'down',
		37: 'left',
		65: 'left',
		39: 'right',
		68: 'right',
	},

	init(g) {
		const self = this;
		game = g;

		document.onkeydown = e => {
			self.down(e);
		};

		document.onkeyup = e => {
			self.up(e);
		};
	},

	register(code, key) {
		this.keys[code] = key;
	},

	emit(type, key) {
		if (game && game.scene && game.scene[type])
			game.scene[type](key);
	},

	translate(type, code) {
		// Don't suppress F5
		if(code === 116) return true;

		if(this.keys[code])
			this.emit(type, this.keys[code]);

		return false;
	},

	down(evt) {
		return this.translate('down', evt.keyCode);
	},

	up(evt) {
		return this.translate('up', evt.keyCode);
	}
};
