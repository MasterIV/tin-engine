import Scene from "./../lib/scene.es6";
import Morph from "./../basic/morph.es6";

export default class TransitionScene extends Scene {
	static createBuffer() {
		const buffer = document.createElement('canvas');
		const ctx = buffer.getContext('2d');
		return {buffer, ctx};
	}

	constructor(toScene, duration, easing) {
		super();

		this.toScene = toScene;

		this.fromBuffer = TransitionScene.createBuffer();
		this.toBuffer = TransitionScene.createBuffer();

		this.progress = 0;
		this.add(new Morph({progress: 1}, duration, easing, this.endTransition.bind(this)));
	}

	setParent(p) {
		console.log(p, this.toScene.constructor);
		this.fromScene = p.scene;

		this.fromScene.setSize(this.size.x, this.size.y);
		this.toScene.setSize(this.size.x, this.size.y);

		return super.setParent(p);
	}

	setSize(w, h) {
		this.fromBuffer.buffer.width = w;
		this.fromBuffer.buffer.height = h;
		this.toBuffer.buffer.width = w;
		this.toBuffer.buffer.height = h;
		return super.setSize(w, h);
	}

	draw(ctx) {
		ctx.save();

		this.fromScene.draw(this.fromBuffer.ctx);
		this.toScene.draw(this.toBuffer.ctx);
		this.performTransition(ctx);

		ctx.restore();
	}

	endTransition() {
		this.parent.goto(this.toScene);
	}

	performTransition(ctx) {
		// override in derived functions
		ctx.drawImage(this.toBuffer.buffer, 0, 0);
	}
}