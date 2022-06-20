import Scene from 'tin-engine/lib/scene';
import Player from '../entity/Player';

export default class GameScene extends Scene {
	constructor() {
		super();
        // create player object
        const player = new Player()
        // add player to the scene
        this.add(player);
        // enable player to receive keyboard events
        this.keyAware.push(player);
    }

    onDraw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.size.x, this.size.y);
    }
}
