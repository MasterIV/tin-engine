import Scene from '../lib/scene.js';
import V2 from '../geo/v2.js';
import RectEntity from './rect.js';
import Morph from './morph.js';
import easing from '../definition/easing.js';

class BasicExampleScene extends Scene {
    constructor() {
        super();
        // Create an entity to animate
        const rect = new RectEntity(new V2(100, 100), new V2(50, 100));
        this.add(rect);

        // Base function that adds a morph to the rect
        const animate = () => {
            // Animate x position to move to the right
            rect.add(new Morph({position: {x: 650}}, 1000, easing.LINEAR, () => {
                // Animate x to move back to the original position, then start over
                rect.add(new Morph({position: {x: 100}}, 1000, easing.LINEAR, animate));
            }));
        };

        // start animation
        animate();
    }
}

export default [
    {
        title: "Basic Example",
        description: `The morph allows you to animate properties of an entity over a duration.
            It detaches itself from it's parent as soon as the animation is completed and then calls the callback.
            Put an easing function to control the easing of the animation.`,
        scene: BasicExampleScene
    }
];
