export default class Colors {
	constructor(stroke, fill, hoverStroke, hoverFill) {
		this.stroke = stroke || 'black';
		this.fill = fill || 'white';
		this.hoverStroke = hoverStroke;
		this.hoverFill = hoverFill;
	}

	apply(ctx, hover) {
		ctx.strokeStyle = hover && this.hoverStroke ? this.hoverStroke : this.stroke;
		ctx.fillStyle = hover && this.hoverFill ? this.hoverFill : this.fill;
	}
}
