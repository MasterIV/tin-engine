import Entity from './entity.js';
import fonts from '../defaults/fonts.js';
import {Zero} from '../geo/v2.js';

export default class TextEntity extends Entity {
	constructor(pos, text, font = fonts.default) {
		super(pos);
		this.text = text;
		this.font = font;
	}

	onDraw(ctx) {
		this.font.apply(ctx, this.hover());
		if (this.wrap) {
			// Recalculating the wrap will only happen if the entity was resized, not every frame
			if (!this.size.equal(this.wrapSize)) {
				let line, words, next;
				line = this.text.join(' ');
				words = line.split(' ');
				this.text = [];
				line = '';

				for (let i = 0; i < words.length; i++) {
					next = ' ';
					if (i == 0)
						next = '';
					next += words[i];
					if (ctx.measureText(line + next).width > this.size.x && line != '') {
						this.text.push(line);
						line = next.trim();
					} else {
						line += next;
					}
				}
				if (line.trim())
					this.text.push(line);

				this.size.y = Math.round(this.text.length * this.font.size * 1.2);
				this.wrapSize = this.size.clone();
			}
			let y = 0;
			for (let i = 0; i < this.text.length; i++) {
				ctx.fillText(this.text[i], 0, y);
				y += Math.round(this.font.size * 1.2);
			}
		} else {
			ctx.fillText(this.text, 0, 0);
		}
	}

	wordWrap(margin) {
		this.wrap = true;
		this.wrapSize = Zero();
		this.text = [this.text];
		if (this.size.x == 0 && this.size.y == 0 && this.parent) {
			this.size = this.parent.size.clone();
			if (margin) {
				this.size.x -= margin;
				this.position.set(margin, margin);
			}
		}
	}
}