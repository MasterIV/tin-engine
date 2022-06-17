export default {
	STEP(t) {
		return t < 1 ? 0 : 1;
	},

	LINEAR(t) {
		return t
	},

	INQUAD(t) {
		return t * t
	},

	OUTQUAD(t) {
		return t * (2 - t)
	},

	INOUTQUAD(t) {
		return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
	},

	INCUBIC(t) {
		return t * t * t
	},

	OUTCUBIC(t) {
		return (--t) * t * t + 1
	},

	INOUTCUBIC(t) {
		return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
	},

	INQUART(t) {
		return t * t * t * t
	},

	OUTQUART(t) {
		return 1 - (--t) * t * t * t
	},

	INOUTQUART(t) {
		return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
	},

	INQUINT(t) {
		return t * t * t * t * t
	},

	OUTQUINT(t) {
		return 1 + (--t) * t * t * t * t
	},

	INOUTQUINT(t) {
		return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
	},

	INELASTIC(t) {
		const b = 0;
		const c = 1;
		const d = 1;
		var s = 1.70158;
		let p = 0;
		let a = c;
		if (t == 0) return b;
		if ((t /= d) == 1) return b + c;
		if (!p) p = d * .3;

		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		}

		else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	},

	OUTELASTIC(t) {
		const b = 0;
		const c = 1;
		const d = 1;
		var s = 1.70158;
		let p = 0;
		let a = c;
		if (t == 0) return b;
		if ((t /= d) == 1) return b + c;
		if (!p) p = d * .3;

		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		}

		else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	}
};
