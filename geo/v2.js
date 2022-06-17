export default class V2 {
	constructor(x, y) {
		this.x = +x;
		this.y = +y;
	}

	sum(v) {
		return new V2(this.x + v.x, this.y + v.y);
	}

	add(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	dif(v) {
		return new V2(this.x - v.x, this.y - v.y);
	}

	sub(v) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

	prd(s) {
		return new V2(this.x * s, this.y * s);
	}

	mul(s) {
		this.x *= s;
		this.y *= s;
		return this;
	}

	quo(s) {
		return new V2(this.x / s, this.y / s);
	}

	div(s) {
		this.x /= s;
		this.y /= s;
		return this;
	}

	angle(v) {
		return Math.atan2(v.y - this.y, v.x - this.x);
	}

	dist(v) {
		return Math.sqrt(Math.pow(v.x - this.x, 2) + Math.pow(v.y - this.y, 2));
	}

	grid(w, h) {
		this.x = Math.floor(this.x / w);
		this.y = Math.floor(this.y / h);
		return this;
	}

	invert() {
		this.x *= -1;
		this.y *= -1;
		return this;
	}

	inverse() {
		return new V2(this.x * -1, this.y * -1);
	}

	clone() {
		return new V2(this.x, this.y);
	}

	equal(v) {
		return v.x == this.x && v.y == this.y
	}

	abs() {
		return new V2(Math.abs(this.x), Math.abs(this.y));
	}

	empty() {
		return !this.x && !this.y;
	}

	set(x, y) {
		this.x = x;
		this.y = y;
		return this;
	}

	fromDeg(angle, length) {
		this.fromRad(angle * ( Math.PI / 180 ), length);
		return this;
	}

	fromRad(angle, length) {
		this.x = Math.round(Math.sin(angle) * length);
		this.y = -Math.round(Math.cos(angle) * length);
		return this;
	}

	static fromDeg(angle, length) {
		return V2.fromRad(angle * ( Math.PI / 180 ), length);
	}

	static fromRad(angle, length) {
		const x = Math.round(Math.sin(angle) * length);
		const y = -Math.round(Math.cos(angle) * length);
		return new V2(x, y);
	};
}

export function Zero() {
	return new V2(0, 0);
}
