export default class Circ {
	constructor(center, radius) {
		this.center = center;
		this.radius = radius;
	}

	collision(c) {
		const dist = this.center.dist(c.center);
		const rsum = this.radius + c.radius;
		return dist < rsum;
	}

	inside(v) {
		return v.dist(this.center) < this.radius;
	}
}