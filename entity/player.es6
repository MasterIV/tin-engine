import Entity from './../basic/entity.es6';
import  V2 from './../geo/v2.es6';
import  colors from './../config/colors.es6';
import  RectEntity from './../basic/rect.es6';
import  graphics from './../core/graphic.es6';
import  Animation from './../lib/animation.es6';
import {Zero} from './../geo/v2.es6';

graphics.add('img/death.png');

export default class Player extends Entity {
	constructor(pos) {
		super();
		this.position = pos;
		this.add(new RectEntity(Zero(), new V2(40, 80), colors.player));
		this.velocity = new V2(0, 0);
		this.speed = 100;
	}

	onUpdate(delta) {
		this.position.add(this.velocity.prd(delta / 1000));
	}

	down(key) {
		switch (key) {
			case 'up': this.velocity.y = -this.speed; break;
			case 'down': this.velocity.y = this.speed; break;
			case 'left': this.velocity.x = -this.speed; break;
			case 'right': this.velocity.x = this.speed; break;
			case 'space':
				this.parent.add(new Animation('img/death.png', this.position.clone(), 7, 100));
				break;
		}
	}

	up(key) {
		switch (key) {
			case 'up': case 'down': this.velocity.y = 0; break;
			case 'left': case 'right': this.velocity.x = 0; break;
		}
	}
}
