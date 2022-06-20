import Scene from 'tin-engine/lib/scene';
import V2, {Zero} from 'tin-engine/geo/v2';
import config from '../config';
import Button from 'tin-engine/basic/button';
import {VerticalLayout} from 'tin-engine/basic/layout'
import GameScene from './GameScene';
import CreditsScene from './CreditsScene';

export default class TitleScene extends Scene {
	constructor() {
		super();
        // initialize size to use the center method
		this.setSize(config.screen.w, config.screen.h);
        // create layout container to organize buttons
        const layout = new VerticalLayout(new V2(0, 100), 0, 50);
        // add buttons to main menu
        layout.add(Button.create(Zero(), () => this.parent.goto(new GameScene())).rect(300, 50).text('Start'));
        layout.add(Button.create(Zero(), () => this.parent.goto(new CreditsScene())).rect(300, 50).text('Credits'));
        // horizontally center menu on the scene
        this.center(layout);
	}

    onDraw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.size.x, this.size.y);
    }
}
