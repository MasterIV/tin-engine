import V2 from './../geo/v2.es6';
import {Zero} from './../geo/v2.es6';
import  Rect from './../geo/rect.es6';
import  mouse from './../core/mouse.es6';
import {arrayRemove} from './../util.es6';

export default class Entity {
	constructor(pos, size) {
		this.position = pos || Zero();
		this.size = size || Zero();
		this.entities = [];
		this.blocking = [];
		this.parent = null;
		this.visible = true;
	}

	setSize(w, h) {
		this.size.x = w;
		this.size.y = h;
	}

	inheritSize() {
		const origin = new V2(0, 0);
		const end = new V2(0, 0);

		for (let i = 0; i < this.entities.length; i++)
			if (this.entities[i].size) {
				const entity = this.entities[i];
				const p2 = entity.position.sum(entity.size);

				origin.x = Math.min(entity.position.x, origin.x);
				origin.y = Math.min(entity.position.y, origin.y);
				end.x = Math.max(p2.x, end.x);
				end.y = Math.max(p2.y, end.y);
			}

		this.size = end.sub(origin);
	}

	setPosition(x, y) {
		this.position.x = x;
		this.position.y = y;
	}

	setParent(p) {
		this.parent = p;
	}

	add(entity) {
		entity.setParent(this);
		this.entities.push(entity);
	}

	relativeMouse() {
		if (this.parent && this.parent.relativeMouse)
			return this.parent.relativeMouse().dif(this.position);
		else
			return mouse.dif(this.position);
	}

	block(entity) {
		this.blocking.push(entity);
	}

	remove(entity) {
		if (this.entities.indexOf(entity) > -1) arrayRemove(this.entities, entity);
		if (this.blocking.indexOf(entity) > -1) arrayRemove(this.blocking, entity);
	}

	dispatch(list, event, argurment) {
		for (let i = 0; i < list.length; i++)
			if (list[i][event])
				list[i][event](argurment);
	}

	dispatchReverse(list, event, argurment) {
		for (let i = list.length - 1; i >= 0; i--)
			if (list[i][event])
				if (list[i][event](argurment)) return true;
	}

	update(delta) {
		if (this.onUpdate)
			this.onUpdate(delta);

		if (this.blocking.length) {
			this.dispatch(this.blocking, 'update', delta);
		} else {
			this.dispatch(this.entities, 'update', delta);
		}
	}

	getArea() {
		if (this.size.x == 0 && this.size.y == 0) this.inheritSize();
		return new Rect(Zero(), this.size);
	}

	relativeArea() {
		return this.getArea().moved(this.position);
	}

	hover() {
		return this.getArea().inside(this.relativeMouse());
	}

	draw(ctx) {
		if (!this.visible) return;
		ctx.save();
		ctx.translate(this.position.x | 0, this.position.y | 0);

		if (this.onDraw) this.onDraw(ctx);
		this.dispatch(this.entities, 'draw', ctx);
		this.dispatch(this.blocking, 'draw', ctx);
		if (this.postDraw) this.postDraw(ctx);

		ctx.restore();
	}

	click(pos) {
		pos = pos.dif(this.position);
		if (!this.getArea().inside(pos)) return;
		if (this.onClick && this.onClick(pos)) return true;

		if (this.blocking.length) {
			return this.dispatchReverse(this.blocking, 'click', pos);
		} else {
			return this.dispatchReverse(this.entities, 'click', pos);
		}
	}

	mousedown(pos) {
		pos = pos.dif(this.position);
		if (!this.getArea().inside(pos)) return;
		if (this.onMouseDown && this.onMouseDown(pos)) return true;

		if (this.blocking.length) {
			return this.dispatchReverse(this.blocking, 'mousedown', pos);
		} else {
			return this.dispatchReverse(this.entities, 'mousedown', pos);
		}
	}

	mouseup(pos) {
		pos = pos.dif(this.position);
		if (!this.getArea().inside(pos)) return;
		if (this.onMouseUp && this.onMouseUp(pos)) return true;

		if (this.blocking.length) {
			return this.dispatchReverse(this.blocking, 'mouseup', pos);
		} else {
			return this.dispatchReverse(this.entities, 'mouseup', pos);
		}
	}

	center(obj) {
		obj.position.x = this.size.x / 2 - obj.size.x / 2;
		this.add(obj);
	}
}