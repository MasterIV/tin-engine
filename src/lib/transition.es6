import Scene from "./../lib/scene.es6";
import game from "./../core/game.es6";
import Morph from "./../basic/morph.es6";

export default class TransitionScene extends Scene {
	constructor(toScene, duration, easing) {
		super();

		if (game.scene) this.add(this.fromScene = game.scene);
		if (toScene) this.add(this.toScene = toScene);

		this.fromBuffer = this.createBuffer();
		this.toBuffer = this.createBuffer();

		this.progress = 0;
		this.add(new Morph({progress: 1}, duration, easing, this.endTransition.bind(this)));
	}

	createBuffer() {
		const buffer = document.createElement('canvas');
		buffer.width = this.size.x;
		buffer.height = this.size.y;
		const ctx = buffer.getContext('2d');
		return {buffer, ctx};
	}

	draw(ctx) {
		ctx.save();

		this.fromScene.draw(this.fromBuffer.ctx);
		this.toScene.draw(this.toBuffer.ctx);
		this.performTransition(ctx);

		ctx.restore();
	}

	endTransition() {
		game.scene = this.toScene;
	}

	performTransition(ctx) {
		// override in derived functions
		ctx.drawImage(this.toBuffer.buffer, 0, 0);
	}

	click(pos) {
		this.toScene.click(pos);
	}

	mousedown(pos) {
		this.toScene.mousedown(pos);
	}

	mouseup(pos) {
		this.toScene.mouseup(pos);
	}
}