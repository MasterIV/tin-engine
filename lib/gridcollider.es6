import V2 from './../geo/v2.es6';

export default class GridCollider {
	constructor(subject, map, obstacles = []) {
		this.subject = subject;
		this.map = map;
		this.obstacles = obstacles;
	}

	static factory(map, obstacles = []) {
		return subject => new GridCollider(subject, map, obstacles);
	}

	move(move) {
		const t = this.map.tile;
		const steps = Math.ceil(Math.max(Math.abs(move.x) / t.x, Math.abs(move.y) / t.y));
		const collision = {x: false, y: false};

		if (steps > 1) {
			move.div(steps);

			for (let i = 0; i < steps && (move.x || move.y); i++) {
				this.checkCollisionStep(move, collision);
				if (collision.x) move.x = 0;
				if (collision.y) move.y = 0;
			}
		} else {
			this.checkCollisionStep(move, collision);
		}
	}

	checkHorizontalCollision(move, pos, collision) {
		if (!move.x) return;

		const t = this.map.tile;
		const s = this.subject.size;
		const p = this.subject.position;

		const pxOffsetX = (move.x > 0 ? s.x : 0);
		const tileOffsetX = ( move.x < 0 ? t.x : 0);

		const firstTileY = Math.floor(pos.y / t.y);
		const lastTileY = Math.ceil((pos.y + s.y) / t.y);
		const tileX = Math.floor((pos.x + move.x + pxOffsetX) / t.x);

		for (let tileY = firstTileY; tileY < lastTileY; tileY++) {
			if (this.map.blocked(new V2(tileX, tileY))) {
				collision.x = true;
				p.x = tileX * t.x - pxOffsetX + tileOffsetX;
				return;
			}
		}

		const a = this.subject.getArea().moved(new V2(p.x, pos.y));
		for (const i in this.obstacles) {
			const o = this.obstacles[i];
			if (( move.x > 0 && o.position.x > p.x) || (move.x < 0 && o.position.x < p.x))
				if (o.relativeArea().collision(a)) {
					collision.x = true;
					p.x = tileX * t.x - pxOffsetX + tileOffsetX;
					return;
				}
		}
	}

	checkVerticalCollision(move, pos, collision) {
		if (!move.y) return;

		const t = this.map.tile;
		const s = this.subject.size;
		const p = this.subject.position;

		const pxOffsetY = ( move.y > 0 ? s.y : 0);
		const tileOffsetY = ( move.y < 0 ? t.y : 0);

		const firstTileX = Math.floor(p.x / t.x);
		const lastTileX = Math.ceil(( p.x + s.x ) / t.x);
		const tileY = Math.floor(( pos.y + move.y + pxOffsetY) / t.y);

		for (let tileX = firstTileX; tileX < lastTileX; tileX++) {
			if (this.map.blocked(new V2(tileX, tileY))) {
				collision.y = true;
				p.y = tileY * t.y - pxOffsetY + tileOffsetY;
				return;
			}
		}

		const a = this.subject.getArea().moved(new V2(pos.x, p.y));
		for (const i in this.obstacles) {
			const o = this.obstacles[i];
			if (( move.y > 0 && o.position.y > p.y) || (move.y < 0 && o.position.y < p.y))
				if (o.relativeArea().collision(a)) {
					collision.y = true;
					p.y = tileY * t.y - pxOffsetY + tileOffsetY;
					return;
				}
		}
	}

	checkCollisionStep(move, collision) {
		const pos = this.subject.position.clone();
		this.subject.position.add(move);

		this.checkHorizontalCollision(move, pos, collision);
		this.checkVerticalCollision(move, pos, collision);
	}
}
