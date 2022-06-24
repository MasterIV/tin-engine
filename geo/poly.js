import V2 from './v2.js';
import Rect from './rect.js';
import { intersect } from '../util.js';

export default class Poly {
	constructor(vector_list) {
		this.points = vector_list;
		this.calcSize();
	}

	static create(vector_list) {
		return new Poly(vector_list);
	}

	// Get a surrounding rectangle for rough checks
	calcSize() {
		const origin = new V2(this.points[0].x, this.points[0].y);
		const end = new V2(this.points[0].x, this.points[0].y);

		for (let i = 0; i < this.points.length; i++) {
			const point = this.points[i];

			origin.x = Math.min(point.x, origin.x);
			origin.y = Math.min(point.y, origin.y);
			end.x = Math.max(point.x + 1, end.x);
			end.y = Math.max(point.y + 1, end.y);
		}

		this.sizeRect = new Rect(origin, end);
	}

	// Returns the offset relative to 0,0
	getOffset() {
		return new V2(this.sizeRect.p1.x, this.sizeRect.p1.y);
	}

	// Return width / height of surrounding rectangle
	getSize() {
		return new V2(this.sizeRect.p2.x - this.sizeRect.p1.x, this.sizeRect.p2.y - this.sizeRect.p1.y);
	}

	move(v) {
		for (let i = 0; i < this.points.length; i++)
			this.points[i].add(v);
		this.calcSize();
	}

	// Returns true if given vector is inside the polygon, false otherwise.
	// Point on line is treated as inside.
	inside(v) {
		if (!this.sizeRect.inside(v)) return false;

		// even-odd rule

		let t = -1;
		let tpoints = [
				new V2(this.points[this.points.length - 1].x,
						this.points[this.points.length - 1].y)
		];

		tpoints = tpoints.concat(this.points);

		for (let i = 0; i < tpoints.length - 1; i++) {
			t *= intersect(v, tpoints[i], tpoints[i + 1]);
		}

		return t >= 0;
	}
}
