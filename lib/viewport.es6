import Entity from './../basic/entity.es6';
import V2 from './../geo/v2.es6';
import Rect from './../geo/rect.es6';
import Morph from './../basic/morph.es6';

export default class ViewPort extends Entity {
	constructor(updateHidden) {
		super();
		this.updateHidden = updateHidden;
		this.subject = null;
		this.drag = false;
		this.dragging = null;
		this.dragStart = null;
	}

	setParent(p) {
		this.parent = p;
		this.visible = p.size.clone();
	}

	getVisibleArea() {
		if (this.size.x == 0 && this.size.y == 0) this.inheritSize();
		const pos = this.position.inverse();
		return new Rect(pos, pos.sum(this.visible));
	}

	dispatch(list, event, argurment) {
		for (let i = 0; i < list.length; i++)
			if (list[i][event]) {

				if (event == 'draw' && this.getVisibleArea().collision(list[i].relativeArea()))
					list[i].draw(argurment);
				if (event == 'update' && (this.updateHidden || this.getVisibleArea().collision(list[i].relativeArea())))
					list[i].update(argurment);
				else
					list[i][event](argurment);
			}
	}

	follow(entity) {
		this.subject = entity;
	}

	scrollTo(pos, speed, callback) {
		this.add(new Morph({position: pos}, speed, null, callback));
	}

	dragable(status) {
		this.drag = status;
	}

	onMouseDown(pos) {
		if (this.drag) {
			this.dragging = pos;
			this.dragStart = this.position.clone();
		}
	}

	onMouseUp(pos) {
		if (this.drag) {
			this.dragging = null;
			this.dragStart = null;
		}
	}

	setPosition(x, y) {
		this.position.x = Math.max(Math.min(0, x), this.visible.x - this.size.x);
		this.position.y = Math.max(Math.min(0, y), this.visible.y - this.size.y);
	}

	click(pos) {
		const dif = this.dragStart ? this.dragStart.dif(this.position) : new V2(0, 0);
		if (this.dragging == null || (Math.abs(dif.x) < 2 && Math.abs(dif.y) < 2))
			super.click(pos);
	}

	update(delta) {
		super.update(delta);

		if (this.subject) {
			this.setPosition(this.visible.x / 2 - this.subject.position.x, this.visible.y / 2 - this.subject.position.y);
		} else if (this.dragging) {
			const pos = this.parent.relativeMouse().dif(this.dragging);
			this.setPosition(pos.x, pos.y);
		}
	}

	centerSelf() {
		if (this.size.x == 0 && this.size.y == 0) this.inheritSize();
		this.position.x = ( this.parent.size.x - this.size.x ) / 2;
		this.position.y = ( this.parent.size.y - this.size.y ) / 2;
	}
}

