import Entity from './../basic/entity.es6';
import fonts from './../config/fonts.es6';

export default class TextEntity extends Entity {
	constructor(pos, text, font) {
		super(pos);
		this.text = text;
		this.font = font || fonts.default;
	}

	onDraw(ctx) {
		this.font.apply(ctx, this.hover());
		ctx.fillText(this.text, 0, 0);
	}
}