import Scene from 'tin-engine/lib/scene';
import V2, {Zero} from 'tin-engine/geo/v2';
import config from '../config';
import Button from 'tin-engine/basic/button';
import TextEntity from 'tin-engine/basic/text';
import {VerticalLayout} from 'tin-engine/basic/layout'

export default class CreditsScene extends Scene {
	constructor() {
		super();
        // initialize size to use the center method
		this.setSize(config.screen.w, config.screen.h);
        // create layout container to organize buttons
        const layout = new VerticalLayout(new V2(0, 100), 0, 100);
        // add some credits
        layout.add(new TextEntity(Zero(), 'Syrup'));
        layout.add(new TextEntity(Zero(), 'Felix'));
        // add back button
        layout.add(Button.create(Zero(), () => this.parent.goto(this.previous)).rect(300, 50).text('Back'));
        // align items within the layout
        layout.align('center');
        // horizontally center menu on the scene
        this.center(layout);
	}

    setParent(game) {
        // this is called before the scene gets set to the new value
        this.previous = game.scene;
        super.setParent(game);
    }

    onDraw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.size.x, this.size.y);
    }
}
