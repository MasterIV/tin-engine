import V2 from './../geo/v2.es6';

export default class Rect {
	constructor(p1, p2) {
		this.p1 = p1;
		this.p2 = p2;
	}

	static create(x1, y1, x2, y2) {
		return new Rect(new V2(x1, y1), new V2(x2, y2));
	}

	collision(r) {
		return this.p1.x < r.p2.x
				&& this.p2.x > r.p1.x
				&& this.p1.y < r.p2.y
				&& this.p2.y > r.p1.y;
	}

	combine(r) {
		return new Rect(
				new V2(Math.min(this.p1.x, r.p1.x), Math.min(this.p1.y, r.p1.y)),
				new V2(Math.max(this.p2.x, r.p2.x), Math.max(this.p2.y, r.p2.y))
		);
	}

	moved(v) {
		return new Rect(
				this.p1.sum(v),
				this.p2.sum(v)
		);
	}

	width() {
		return this.p2.x - this.p1.x;
	}

	height() {
		return this.p2.y - this.p1.y;
	}

	move(v) {
		this.p1.add(v);
		this.p2.add(v);
	}

	grid(w, h) {
		this.p1.grid(w, h);
		this.p2.grid(w, h);
	}

	inside(v) {
		return this.p1.x < v.x
				&& this.p2.x > v.x
				&& this.p1.y < v.y
				&& this.p2.y > v.y;
	}
}

