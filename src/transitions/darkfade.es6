import TransitionScene from './../lib/transition.es6';

export default class DarkfadeTransition extends TransitionScene {
	constructor(toScene, duration, easing) {
		super(toScene, duration, easing);
	}

	performTransition(ctx) {
		// Dark base
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, this.size.x, this.size.y);

		const opacity = Math.abs(this.progress - 0.5) * 2;
		ctx.globalAlpha = opacity;
		if (this.progress <= 0.5) {
			ctx.drawImage(this.fromBuffer.buffer, 0, 0);
		} else {
			ctx.drawImage(this.toBuffer.buffer, 0, 0);
		}
	}
}