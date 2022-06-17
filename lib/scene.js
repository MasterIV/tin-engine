import Entity from '../basic/entity.js';
import  graphics from './../core/graphic.js';

export default class Scene extends Entity {
	constructor() {
		super();
		this.keyAware = [];
	}

	onDraw(ctx) {
		if (ctx.debug) {
			ctx.fillStyle = "#dddddd";
			ctx.fillRect(0, 0, this.size.x, this.size.y);
		}

		if (this.bg) {
			ctx.drawImage(graphics[this.bg], 0, 0);
		}
	}

	up(key) {
		this.dispatch(this.keyAware, 'up', key);
	}

	down(key) {
		this.dispatch(this.keyAware, 'down', key);
	}
}
