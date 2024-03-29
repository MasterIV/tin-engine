import Entity from "./../basic/entity.js";
import Poly from "./../geo/poly.js";
import colors from "./../defaults/colors.js";

export default class PolyEntity extends Entity {
	constructor(pos, vector_list, color = colors.default) {
		// Be careful that a rectangle of 0, 0, size.x, size.y does not surround the polygon!
		// See PolyEntity.clearOffset();
		const poly = new Poly(vector_list)
		super(pos, poly.getSize());

		this.color = color;
		this.poly = poly;

	}

	onDraw(ctx) {
		this.color.apply(ctx, this.hover());

		ctx.beginPath();

		let first = true;
		for (let i = 0; i < this.poly.points.length; i++) {
			const point = this.poly.points[i];
			if (first) {
				ctx.moveTo(point.x, point.y);
				first = false;
			} else {
				ctx.lineTo(point.x, point.y);
			}
		}

		ctx.closePath();

		ctx.fill();
		ctx.stroke();

		if (ctx.debug) { // draws the surrounding rectangle of the polygon and the entity's position (red dot)
			const offset = this.poly.getOffset();
			ctx.strokeRect(offset.x, offset.y, this.size.x, this.size.y);
			ctx.fillStyle = '#ff0000';
			ctx.fillRect(-1, -1, 3, 3);
		}
	}

	hover() {
		return this.poly.inside(this.relativeMouse());
	}

	// Ensures that the entity's position is equal to the the polygon surrounding rectangle's upper left corner
	// ### Will move the entity!
	clearOffset() {
		const offset = this.poly.getOffset();
		this.poly.move(offset.inverse());
		this.position.add(offset);
	}
}
