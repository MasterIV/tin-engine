import Entity from './../basic/entity.js';
import colors from './../defaults/colors.js';

export default class RectEntity extends Entity {
	constructor(pos, size, color = colors.default) {
		super(pos, size);
		this.color = color;
	}

	onDraw(ctx) {
		this.color.apply(ctx, this.hover());
		ctx.fillRect(0, 0, this.size.x | 0, this.size.y | 0);
		ctx.strokeRect(0, 0, this.size.x | 0, this.size.y | 0);
	}
}