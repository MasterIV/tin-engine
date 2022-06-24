import Scene from '../lib/scene.js';
import V2 from '../geo/v2.js';
import mouse from '../core/mouse.js';
import TextEntity from '../basic/text.js';

class BasicExampleScene extends Scene {
    constructor() {
        super();
        this.display = new TextEntity(new V2(400, 300), '');
        this.add(this.display);
    }

    // careful: overwriting this method will prevent children from updating
    update() {
        this.display.text = 'Mouse position: ' + mouse.x + ', ' + mouse.y;
    }

    setParent(game) {
        super.setParent(game);
        // Init mouse, usually this would be done during game init
        mouse.init(game)
    }
}

export default [
    {
        title: "Basic Example",
        description: `This examples how to initialize the mouse and access it's position.`,
        scene: BasicExampleScene
    }
];
