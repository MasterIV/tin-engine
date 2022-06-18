import fonts from './../defaults/fonts.js';
import V2 from './../geo/v2.js';

window.requestAnimFrame = ((() =>
	window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	((callback, element) => { window.setTimeout(callback, 25); })
))();

export default class Game {
	constructor(config, canvas) {
		this.scale = 1;
		this.size = config.screen ? new V2(config.screen.w, config.screen.h) : new V2(800, 600);
		this.smooth = config.smooth;

		this.display = canvas || document.getElementById('gameframe');
		this.displayCtx = this.display.getContext('2d');

		this.buffer = document.createElement('canvas');
		this.bufferCtx = this.buffer.getContext('2d');
		this.buffer.width = this.size.x;
		this.buffer.height = this.size.y;

		if(config.debug) {
			this.fps = 25;
			this.frames = 0;
			setInterval(this.updateFramerate.bind(this), 1000);
			this.bufferCtx.debug = true;
		}

		if (config.scale) {
			this.resize();
			window.onresize = this.resize.bind(this);
		} else {
			this.display.width = this.size.x;
			this.display.height = this.size.y;
		}

		this.loop = this.loop.bind(this);
	}

	goto(scene) {
		scene.setSize(this.size.x, this.size.y);
		scene.setParent(this);
		this.scene = scene;
	}

	run(scene) {
		this.goto( scene );
		this.lastUpdate = Date.now();
		this.loop();
	}

	resize() {
		const fw = window.innerWidth / this.size.x;
		const fh = window.innerHeight / this.size.y;

		this.scale = Math.min(fw, fh);
		if(!this.smooth) this.scale = Math.max(1, this.scale | 0);

		this.display.width = this.size.x * this.scale;
		this.display.height = this.size.y * this.scale;
	}

	updateFramerate() {
		this.fps = this.frames;
		this.frames = 0;
	}

	loop() {
		const now = Date.now();
		const delta = now - this.lastUpdate;

		if (delta < 250 && this.scene) {
			this.update(delta);
			this.draw();
		}

		this.lastUpdate = now;
		this.frames++;

		requestAnimFrame(() => this.loop());
	}

	update(delta) {
		this.scene.update(delta);
	}

	draw() {
		this.scene.draw(this.bufferCtx);

		this.display.width = this.display.width;
		this.displayCtx.imageSmoothingEnabled = this.smooth;
		this.displayCtx.drawImage(this.buffer, 0, 0, this.size.x * this.scale, this.size.y * this.scale);

		if (this.bufferCtx.debug) {
			fonts.frames.apply(this.displayCtx);
			this.displayCtx.fillText(this.fps, 15, 15);
		}
	}
}
