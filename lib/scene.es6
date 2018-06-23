import Entity from './../basic/entity.es6';
import  V2 from './../geo/v2.es6';
import {Zero} from './../geo/v2.es6';
import  graphics from './../core/graphic.es6';
import  screen from './../config/screen.es6';
import  config from './../config/config.es6';

export default class Scene extends Entity {
	constructor() {
		super(Zero(), new V2(screen.w, screen.h));
		this.keyAware = [];
	}

	onDraw(ctx) {
		if (config.debug) {
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
