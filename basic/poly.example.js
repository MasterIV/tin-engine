import Scene from '../lib/scene.js';
import V2 from '../geo/v2.js';
import mouse from '../core/mouse.js';
import Colors from '../definition/colors.js';
import FontStyle from '../definition/font.js';
import PolyEntity from './poly.js';

class BasicExampleScene extends Scene {
    constructor() {
        super();
        // draw some polygon
        this.add(new PolyEntity(new V2(300, 200), [
            new V2(10, 0),
            new V2(0, 10),
            new V2(10, 80),
            new V2(40, 60),
            new V2(80, 70),
            new V2(90, 20),
        ]));
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
        description: `This can draw any polygon shape.
            Similar to the rect, it also reacts to mouse over and can be assigned custom colors.`,
        scene: BasicExampleScene
    }
];
