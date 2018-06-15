import Entity from './../basic/entity.es6';
import  graphics from './../core/graphic.es6';
import  V2 from './../geo/v2.es6';

export default class Animation extends Entity {
	constructor(img, pos, frames, speed, loop) {
		this.frames = typeof frames == 'number' ? new V2(frames, 1) : frames;
		this.img = graphics[img];
		this.loop = loop;

		this.duration = speed;
		this.anitime = 0;
		this.frame = 0;
		this.state = 0;

		super(
				pos,
				new V2(this.img.width / this.frames.x, this.img.height / this.frames.y)
		);
	}

	onUpdate(delta) {
		this.anitime += delta;
		this.frame = Math.floor(this.anitime / this.duration);

		if (this.frame >= this.frames.x && !this.loop)
			this.parent.remove(this);

		this.frame %= this.frames.x;
		this.anitime %= this.frames.x * this.duration;
	}

	onDraw(ctx) {
		ctx.drawImage(this.img, this.frame * this.size.x, this.state * this.size.y, this.size.x, this.size.y, 0, 0, this.size.x, this.size.y);
	}
}
