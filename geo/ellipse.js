export default class Elli {
	constructor(center, radii) {
		this.center = center;
		this.radii = radii;
	}

	inside(v) {
		const ins =
			Math.pow(v.x - this.center.x, 2) / Math.pow(this.radii.x * 2, 2)
			+
			Math.pow(v.y - this.center.y, 2) / Math.pow(this.radii.y * 2, 2);

		return ins <= 1;
	}
}