import Entity from './../basic/entity.es6';
import colors from './../config/colors.es6';

export default class RectEntity extends Entity {
	constructor(pos, size, color) {
		super(pos, size);
		this.color = color || colors.default;
	}

	onDraw(ctx) {
		this.color.apply(ctx, this.hover());
		ctx.fillRect(0, 0, this.size.x | 0, this.size.y | 0);
		ctx.strokeRect(0, 0, this.size.x | 0, this.size.y | 0);
	}
}