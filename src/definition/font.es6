export default class FontStyle {
	constructor(size, color, type, hover) {
		this.size = size;
		this.color = color || 'black';
		this.type = type || 'sans-serif';
		this.hover = hover;

		this.align = 'center';
		this.base = 'middle';
	}

	apply(ctx, hover) {
		ctx.textAlign = this.align;
		ctx.textBaseline = this.base;
		ctx.font = `${this.size}px ${this.type}`;
		ctx.fillStyle = hover && this.hover ? this.hover : this.color;
	}
}