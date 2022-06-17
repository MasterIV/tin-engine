import graphics from './../core/graphic.js';
import  V2 from './../geo/v2.js';
import  Entity from './../basic/entity.js';

export default class ImageEntity extends Entity {
	constructor(pos, src, scale) {
		super(pos, new V2(graphics[src].width, graphics[src].height));
		this.img = graphics[src];
		this.scale = scale || 1;
	}

	onDraw(ctx) {
		if (this.size.x >= 1 && this.size.y >= 1)
			ctx.drawImage(this.img, 0, 0, this.size.x | 0, this.size.y | 0, 0, 0, (this.size.x * this.scale) | 0, (this.size.y * this.scale) | 0);
	}
}