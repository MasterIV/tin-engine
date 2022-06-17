let game;

export default {
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

	emit(type, key) {
		if (game && game.scene && game.scene[type])
			game.scene[type](key);
	},

	translate(type, code) {
		switch (code) {
			case 116: return true; break; // F5
			case 32: this.emit(type, 'space'); break;
			case 27: this.emit(type, 'esc'); break;
			case 13: this.emit(type, 'enter'); break;

			case 38: case 87: this.emit(type, 'up'); break;
			case 40: case 83: this.emit(type, 'down'); break;
			case 37: case 65: this.emit(type, 'left'); break;
			case 39: case 68: this.emit(type, 'right'); break;
		}

		return false;
	},

	down(evt = (event) ? event : null) {
		return this.translate('down', evt.keyCode);
	},

	up(evt = (event) ? event : null) {
		return this.translate('up', evt.keyCode);
	}
};
