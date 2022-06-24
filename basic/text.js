import Entity from './entity.js';
import fonts from '../defaults/fonts.js';

export default class TextEntity extends Entity {
	constructor(pos, text, font = fonts.default) {
		super(pos);
		this.text = text;
		this.font = font;
	}

	onDraw(ctx) {
		this.font.apply(ctx, this.hover());
		ctx.fillText(this.text, 0, 0);
	}
}
