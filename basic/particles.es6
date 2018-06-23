import Entity from "./../basic/entity.es6";
import Random from "./../definition/random.es6";
import {Zero} from './../geo/v2.es6';
import {eor} from './../util.es6';

export default class Particles extends Entity {
	constructor(pos, config) {
		super(pos);

		this.config = {
			// Particle Settings
			angle: Random.between(0, 360),
			speed: 50,
			lifetime: 2000,
			scale: 1,
			offset: Zero(),
			color: 'red',

			// Emission Settings
			autoplay: true,
			interval: 1000,
			loop: true,
			rate: 20,
			burst: []
		};

		for (const i in config)
			this.config[i] = config[i];

		this.last = 0;
		this.timer = this.config.autoplay ? 0 : this.config.interval;
		this.rate = this.config.interval / this.config.rate;
		this.pool = [];
	}

	// do not bother to dispatch mouse events
	click(pos) {
	}

	mousedown(pos) {
	}

	mouseup(pos) {
	}

	onUpdate(delta) {
		this.timer += delta;

		if (this.timer < this.config.interval) {
			for (let i = 0; i < this.config.burst.length; i++)
				if (this.config.burst[i].time < this.timer && this.config.burst[i].time >= this.timer - delta)
					for (let j = 0; j < this.config.burst[i].amount; j++)
						this.spawn();

			while (this.last + this.rate < this.timer) {
				this.spawn();
				this.last += this.rate;
			}
		} else if (this.config.loop) {
			this.play();
		}
	}

	spawn() {
		if (this.pool.length) this.add(this.pool.shift().init(eor(this.config.offset), this.config));
		else this.add(new Particle(eor(this.config.offset), this.config));
	}

	play() {
		this.last = 0;
		this.timer = 0;
	}
}

/* ======= Here comes the particle ======= */

class Particle extends Entity {
	constructor(pos, config) {
		super(pos.clone());
		this.velocity = Zero();
		this.init(pos, config);
	}

	init(pos, config) {
		this.position.x = pos.x;
		this.position.y = pos.y;
		this.config = config;
		this.timer = 0;

		this.lifetime = eor(config.lifetime);
		this.velocity.fromDeg(eor(config.angle), eor(config.speed));
		return this;
	}

	update(delta) {
		this.timer += delta;

		if (this.timer > this.lifetime) {
			this.parent.remove(this);
			this.parent.pool.push(this);
			return;
		}

		this.position.add(this.velocity.prd(delta / 1000));
	}

	draw(ctx) {
		if (this.config.sprite) {
			const s = this.config.sprite;
			ctx.drawImage(s, (this.position.x - s.width / 2) | 0, (this.position.y - s.height / 2) | 0);
		} else {
			ctx.fillStyle = this.config.color;
			ctx.fillRect(this.position.x | 0, this.position.y | 0, this.config.scale, this.config.scale);
		}
	}
}