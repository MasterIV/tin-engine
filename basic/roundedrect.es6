import Entity from './entity.es6';
import colors from '../defaults/colors.es6';

export default class RoundedRectEntity extends Entity {
	static path(ctx, w, h, r, borderIn = 0) {
		ctx.beginPath();
		ctx.moveTo(r + borderIn, borderIn);
		ctx.lineTo(w - r - borderIn, borderIn);
		ctx.quadraticCurveTo(w - borderIn, borderIn, w - borderIn, r + borderIn);
		ctx.lineTo(w - borderIn, h - r - borderIn);
		ctx.quadraticCurveTo(w - borderIn, h - borderIn, w - r - borderIn, h - borderIn);
		ctx.lineTo(r + borderIn, h - borderIn);
		ctx.quadraticCurveTo(borderIn, h - borderIn, borderIn, h - r - borderIn);
		ctx.lineTo(borderIn, r - borderIn);
		ctx.quadraticCurveTo(borderIn, borderIn, r + borderIn, borderIn);
		ctx.closePath();
	}

	constructor(pos, size, color = colors.default, radius = 5) {
		super(pos, size);
		this.color = color;
		this.radius = radius;
	}

	onDraw(ctx) {
		this.color.apply(ctx, this.hover());
		// ctx.fillRect(0, 0, this.size.x | 0, this.size.y | 0);
		// ctx.strokeRect(0, 0, this.size.x | 0, this.size.y | 0);

		const w = this.size.x;
		const h = this.size.y;
		const r = this.radius;

		RoundedRectEntity.path(ctx, w, h, r);

		ctx.fill();
		ctx.stroke();
	}
}
