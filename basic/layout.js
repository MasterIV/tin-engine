import Entity from './../basic/entity.js';

class Layout extends Entity {
	constructor(pos, margin, spacing) {
		super(pos);
		this.margin = margin;
		this.spacing = spacing;
	}

	adjustFixed(axis, entity) {
		entity.position[axis] = this.margin;
		if (this.size[axis] < entity.size[axis] + 2 * this.margin)
			this.size[axis] = entity.size[axis] + 2 * this.margin;
	}

	adjustFlexible(axis, entity) {
		let p = this.margin + this.entities.length * this.spacing;
		for (const i in this.entities) p += this.entities[i].size[axis] || 0;
		entity.position[axis] = p;
		this.size[axis] = entity.position[axis] + entity.size[axis] + this.margin;
	}

	align(orientation) {
		for (const i in this.entities) {
			const e = this.entities[i];

			if (orientation == "center") {
				e.position.x = ( this.size.x - e.size.x ) / 2;
			} else if (orientation == "right") {
				e.position.x = this.size.x - e.size.x - this.margin;
			} else if (orientation == "middle") {
				e.position.y = ( this.size.y - e.size.y ) / 2;
			} else if (orientation == "bottom") {
				e.position.y = this.size.y - e.size.y - this.margin;
			}
		}
	}
}

export class VerticalLayout extends Layout {
	constructor(pos, margin, spacing) {
		super(pos, margin, spacing);
	}

	add(e) {
		this.adjustFixed('x', e);
		this.adjustFlexible('y', e);
		Entity.prototype.add.call(this, e);
	}

	align(orientation) {
		for (const i in this.entities) {
			const e = this.entities[i];

			if (orientation == "center") {
				e.position.x = ( this.size.x - e.size.x ) / 2;
			} else if (orientation == "right") {
				e.position.x = this.size.x - e.size.x - this.margin;
			} else {
				e.position.x = 0;
			}
		}
	}
}

export class HorizontalLayout extends Layout {
	constructor(pos, margin, spacing) {
		super(pos, margin, spacing);
	}

	add(e) {
		this.adjustFixed('y', e);
		this.adjustFlexible('x', e);
		Entity.prototype.add.call(this, e);
	}

	align(orientation) {
		for (const i in this.entities) {
			const e = this.entities[i];

			if (orientation == "center") {
				e.position.y = ( this.size.y - e.size.y ) / 2;
			} else if (orientation == "bottom") {
				e.position.y = this.size.y - e.size.y - this.margin;
			} else {
				e.position.y = 0;
			}
		}
	}
}
