import Scene from '../lib/scene.js';
import V2 from '../geo/v2.js';
import mouse from '../core/mouse.js';
import Colors from '../definition/colors.js';
import RectEntity from './rect.js';

class BasicExampleScene extends Scene {
    constructor() {
        super();
        // default color
        this.add(new RectEntity(new V2(300, 100), new V2(200, 100)));
        // custom color
        const color = new Colors('red', 'pink', 'blue', 'lightblue');
        this.add(new RectEntity(new V2(200, 250), new V2(400, 100), color));
        // custom color without mouseover
        const simpleColor = new Colors('green', 'yellow');
        this.add(new RectEntity(new V2(300, 400), new V2(200, 100), simpleColor));
    }

    setParent(game) {
        super.setParent(game);
        // Init mouse to enable hover effects
        // usually this would be done during game init
        mouse.init(game)
    }
}

export default [
    {
        title: "Basic Example",
        description: `This entity draws a simple Rectangle.
            Useful fo placeholders in early game development,
            to be replaced late by an ImageEntity or an Animation.`,
        scene: BasicExampleScene
    }
];
