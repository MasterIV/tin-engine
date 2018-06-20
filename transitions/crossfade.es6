import TransitionScene from './../lib/transition.es6';

export default class CrossfadeTransition extends TransitionScene {
	constructor(toScene, duration, easing) {
		super(toScene, duration, easing);
	}

	performTransition(ctx) {
		ctx.drawImage(this.fromBuffer.buffer, 0, 0);
		ctx.globalAlpha = this.progress;
		ctx.drawImage(this.toBuffer.buffer, 0, 0);
	}
}
