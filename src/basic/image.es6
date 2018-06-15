import graphics from './../core/graphic.es6';
import  V2 from './../geo/v2.es6';
import  Entity from './../basic/entity.es6';

export default class ImageEntity extends Entity {
	constructor(pos, src, scale) {
		this.img = graphics[src];
		super(pos, new V2(this.img.width, this.img.height));
		this.scale = scale || 1;
	}

	onDraw(ctx) {
		if (this.size.x >= 1 && this.size.y >= 1)
			ctx.drawImage(this.img, 0, 0, this.size.x | 0, this.size.y | 0, 0, 0, (this.size.x * this.scale) | 0, (this.size.y * this.scale) | 0);
	}
}