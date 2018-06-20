import TransitionScene from './../lib/transition.es6';

export default class SlideInLeftTransition extends TransitionScene {
	constructor(toScene, duration, easing) {
		super(toScene, duration, easing);
	}

	performTransition(ctx) {
		const offset = -this.progress * this.size.x;
		ctx.drawImage(this.fromBuffer.buffer, offset, 0);
		ctx.drawImage(this.toBuffer.buffer, this.size.x + offset, 0);
	}
}
