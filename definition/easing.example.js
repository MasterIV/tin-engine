import Scene from '../lib/scene.js';
import V2 from '../geo/v2.js';
import RectEntity from '../basic/rect.js';
import TextEntity from '../basic/text.js';
import Morph from '../basic/morph.js';
import easing from './easing.js';
import FontStyle from './font.js';

class BasicExampleScene extends Scene {
    constructor() {
        super();
        // Label font
        const label = new FontStyle(15);
        label.align = 'left';

        // Base function that adds a morph to the rect
        const animate = (entity, e) => {
            entity.add(new Morph({position: {x: 650}}, 2000, easing[e], () => {
                entity.add(new Morph({position: {x: 250}}, 2000, easing[e], () => {
                    animate(entity, e); // Restart animation
                }));
            }));
        };

        // Go over all easing types and create sample animation for each
        Object.keys(easing).forEach((e, i) => {
            const rect = new RectEntity(new V2(250, 50+i*30), new V2(15, 15));
            this.add(new TextEntity(new V2(20, 65+i*30), e, label));
            this.add(rect);
            animate(rect, e);
        });
    }
}

export default [
    {
        title: "Basic Example",
        description: `This example visualizes the different types of easing.`,
        scene: BasicExampleScene
    }
];
