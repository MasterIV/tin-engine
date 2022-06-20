import TransitionScene from './../lib/transition.js';

export default class SlideInRightTransition extends TransitionScene {
	constructor(toScene, duration, easing) {
		super(toScene, duration, easing);
	}

	performTransition(ctx) {
		const offset = this.progress * this.size.x;
		ctx.drawImage(this.fromBuffer.buffer, offset, 0);
		ctx.drawImage(this.toBuffer.buffer, -this.size.x + offset, 0);
	}
}
